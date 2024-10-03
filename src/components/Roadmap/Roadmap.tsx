import {
  ReactFlow,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  Panel,
} from "@xyflow/react";
import { useMemo, useEffect } from "react";
import CourseNode from "./nodes/CourseNode";
import SemesterNode from "./nodes/SemesterNode";
import LegendNode from "./nodes/LegendNode";
import { buildRoadmap } from "./util/buildRoadmap.util";
import ShowEdgesToggle from "./ShowEdgesToggle";
import "./Roadmap.css";
import "@xyflow/react/dist/style.css";
import { type Roadmap } from "@customTypes/index";
import Paper from "@mui/material/Paper/Paper";
import useRoadmapSelectsStore from "@store/useRoadmapSelectsStore";
import useIsEdgesHiddenStore from "@store/useIsEdgesHiddenStore";

const createTitleNode = (cohort: string, degree: string, career: string) => {
  return {
    id: "titleNode",
    className: "node-title",
    position: { x: 300, y: 30 },
    data: {
      label: <h1>{`${cohort} - ${degree} - ${career}`}</h1>,
    },
    draggable: false,
    selectable: false,
  };
};

interface RoadmapProps {
  roadmapData: Roadmap;
}

export default function Roadmap({ roadmapData }: RoadmapProps) {
  const { degree, career, cohort } = useRoadmapSelectsStore();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgeChange] = useEdgesState<Edge>([]);
  const { isEdgesHidden } = useIsEdgesHiddenStore();

  const nodeTypes = useMemo(
    () => ({
      courseNode: CourseNode,
      semesterNode: SemesterNode,
      legendNode: LegendNode,
    }),
    []
  );

  useEffect(() => {
    if (roadmapData?.coursesByYearSemester.length > 0) {
      const { nodes, edges } = buildRoadmap(roadmapData, isEdgesHidden);
      setNodes(nodes);
      setEdges(edges);
    }
  }, [roadmapData, setEdges, setNodes, isEdgesHidden]);

  const titleNode = useMemo(
    () => createTitleNode(cohort, degree, career),
    [career, cohort, degree]
  );

  return (
    <div>
      <div className="flowchart">
        <ReactFlow
          nodes={[titleNode, ...nodes]}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgeChange}
          zoomOnDoubleClick={false}
        >
          <Controls position="top-right" />
          <Panel>
            <Paper sx={{ padding: "1rem" }}>
              <ShowEdgesToggle />
            </Paper>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
