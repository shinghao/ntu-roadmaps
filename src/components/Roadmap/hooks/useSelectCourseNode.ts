import { Edge, useReactFlow } from "@xyflow/react";
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

  const setEdgesOnUnselectCourse = () => {
    setEdges((currentEdges) =>
      currentEdges.map((edge) => ({
        ...edge,
        hidden: isEdgesHidden,
        animated: false,
      }))
    );
  };

  const setEdgesOnSelectCourse = (selectedCourse: string) => {
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
  };

  const onSelectCourseNode = (id: string, isSelected: boolean) => {
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
  };

  return { onSelectCourseNode };
};
export default useSelectCourseNode;
