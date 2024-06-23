import { Edge } from "reactflow";

export const getAllConnectedNodes = (
  curSource: string,
  edges: Edge[]
): string[] => {
  if (!curSource) {
    return [];
  }

  const queue = [curSource];
  const connectedNodes = new Set<string>();

  while (queue.length !== 0) {
    const cur = queue.shift();
    if (cur && !connectedNodes.has(cur)) {
      connectedNodes.add(cur);

      edges.forEach((edge) => {
        if (edge.source === cur && !connectedNodes.has(edge.target)) {
          queue.push(edge.target);
        }
      });
    }
  }

  return Array.from(connectedNodes);
};
