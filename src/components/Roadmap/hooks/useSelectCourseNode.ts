import { type Edge, useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import useIsEdgesHiddenStore from "@store/useIsEdgesHiddenStore";

function getAllConnectedEdges(
  selectedCourse: string,
  edges: Edge[]
): Set<string> {
  if (!selectedCourse) {
    return new Set();
  }

  const connectedNodes = new Set<string>();
  const connectedEdges = new Set<string>();

  const traverse = (node: string, isSource: boolean) => {
    const queue = [node];
    while (queue.length !== 0) {
      const curNode = queue.shift()!;
      connectedNodes.add(curNode);

      edges.forEach((edge) => {
        const [source, target] = isSource
          ? [edge.source, edge.target]
          : [edge.target, edge.source];
        if (source === curNode && !connectedNodes.has(target)) {
          connectedEdges.add(edge.id);
          queue.push(target);
        }
      });
    }
  };

  traverse(selectedCourse, true);
  traverse(selectedCourse, false);

  return connectedEdges;
}

const useSelectCourseNode = () => {
  const { setNodes, setEdges } = useReactFlow();
  const { isEdgesHidden } = useIsEdgesHiddenStore();

  const setEdgesOnUnselectCourse = useCallback(() => {
    setEdges((currentEdges) =>
      currentEdges.map((edge) => ({
        ...edge,
        hidden: isEdgesHidden,
        animated: false,
      }))
    );
  }, [isEdgesHidden, setEdges]);

  const setEdgesOnSelectCourse = useCallback(
    (selectedCourse: string) => {
      setEdges((currentEdges) => {
        const edgesToHighlight = getAllConnectedEdges(
          selectedCourse,
          currentEdges
        );
        return currentEdges.map((edge) => ({
          ...edge,
          hidden: edgesToHighlight.has(edge.id) ? false : true,
          animated: edgesToHighlight.has(edge.id) ? true : false,
        }));
      });
    },
    [setEdges]
  );

  const onSelectCourseNode = useCallback(
    (id: string, isSelected: boolean) => {
      const selectedCourse = isSelected ? id : "";
      setNodes((currentNodes) =>
        currentNodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            isSelected: node.data.id === selectedCourse,
            isHandlesHidden: node.data.id !== selectedCourse,
          },
        }))
      );

      selectedCourse === ""
        ? setEdgesOnUnselectCourse()
        : setEdgesOnSelectCourse(selectedCourse);
    },
    [setEdgesOnSelectCourse, setEdgesOnUnselectCourse, setNodes]
  );

  return { onSelectCourseNode };
};
export default useSelectCourseNode;
