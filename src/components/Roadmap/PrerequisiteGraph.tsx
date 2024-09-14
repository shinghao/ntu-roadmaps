import {
  ReactFlow,
  Node,
  Edge,
  MarkerType,
  ReactFlowProvider,
} from "@xyflow/react";
import "./PrerequisiteGraph.css";
import { useMemo } from "react";

interface Props {
  courseId: string;
  prerequisites: string[];
}

const PrerequisiteGraph = ({ courseId, prerequisites }: Props) => {
  const { nodes, edges } = useMemo(() => {
    let offset = -100;

    const mainNode: Node = {
      id: "prereq-mainnode",
      data: { label: courseId },
      position: { x: 150, y: 70 },
      style: { backgroundColor: "orange" },
      draggable: false,
    };

    const prereqNodes: Node[] = prerequisites.map((prereq) => ({
      id: `prereq-${prereq}`,
      data: { label: prereq },
      position: { x: (offset += 180), y: 0 },
      draggable: false,
    }));

    const edges: Edge[] = prereqNodes.map((prereqNode) => ({
      id: `${prereqNode.id}-prereq-mainnode`,
      source: prereqNode.id,
      target: "prereq-mainnode",
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      animated: true,
    }));

    const nodes = [mainNode, ...prereqNodes];

    return { nodes, edges };
  }, [courseId, prerequisites]);

  return (
    <div className="prerequisite-graph-container">
      <h3>Prerequisites</h3>
      <div className="prerequisite-graph">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            zoomOnScroll={false}
            preventScrolling
            nodesDraggable={false}
            nodesConnectable={false}
            nodesFocusable={false}
            zoomOnPinch={false}
          ></ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default PrerequisiteGraph;
