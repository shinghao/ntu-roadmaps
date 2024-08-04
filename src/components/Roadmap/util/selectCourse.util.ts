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
  setEdges: (payload: Edge[] | ((edges: Edge[]) => Edge[])) => void
) => {
  setEdges((currentEdges) =>
    currentEdges.map((edge) => ({
      ...edge,
      hidden: false,
      animated: false,
    }))
  );
};

export const setEdgesOnSelectCourse = (
  setEdges: (payload: Edge[] | ((edges: Edge[]) => Edge[])) => void,
  selectedCourse: string
) => {
  setEdges((currentEdges) => {
    const edgesToHighlight = getAllConnectedEdges(selectedCourse, currentEdges);
    return currentEdges.map((edge) => ({
      ...edge,
      hidden: edgesToHighlight.has(edge.id) ? false : true,
      animated: edgesToHighlight.has(edge.id) ? true : false,
    }));
  });
};
