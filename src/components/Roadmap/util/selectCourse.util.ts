import { Edge } from "reactflow";

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
  edges: Edge[],
  setEdges: (edges: Edge[]) => void
) => {
  const updatedEdges = edges.map((edge) => {
    edge.hidden = edge.animated = false;
    return edge;
  });
  setEdges(updatedEdges);
  return;
};

export const setEdgesOnSelectCourse = (
  edges: Edge[],
  setEdges: (edges: Edge[]) => void,
  selectedCourse: string
) => {
  const edgesToHighlight = getAllConnectedEdges(selectedCourse, edges);
  const updatedEdges = edges.map((edge) => {
    if (edgesToHighlight.has(edge.id)) {
      edge.hidden = false;
      edge.animated = true;
    } else {
      edge.hidden = true;
      edge.animated = false;
    }
    return edge;
  });
  setEdges(updatedEdges);
};
