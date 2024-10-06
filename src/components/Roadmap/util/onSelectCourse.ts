import { Edge } from "@xyflow/react";

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

export const setEdgesOnUnselectCourse = (
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  isEdgesHidden: boolean
) => {
  setEdges((currentEdges) =>
    currentEdges.map((edge) => ({
      ...edge,
      hidden: isEdgesHidden,
      animated: false,
    }))
  );
};

export const setEdgesOnSelectCourse = (
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  selectedCourse: string
) => {
  setEdges((currentEdges) => {
    const edgesToHighlight = getAllConnectedEdges(selectedCourse, currentEdges);
    const nodesInPlay = new Set<string>();

    const updatedEdges = currentEdges.map((edge) => {
      const shouldShowEdge = edgesToHighlight.has(edge.id);
      if (shouldShowEdge) {
        nodesInPlay.add(edge.source);
        nodesInPlay.add(edge.target);
      }

      return {
        ...edge,
        hidden: shouldShowEdge ? false : true,
        animated: shouldShowEdge ? true : false,
      };
    });

    return updatedEdges;
  });
};
