import { ReactFlow, Controls, Panel } from "@xyflow/react";
import { useMemo } from "react";
import CourseNode from "./nodes/CourseNode";
import SemesterNode from "./nodes/SemesterNode";
import LegendNode from "./nodes/LegendNode";
import ShowEdgesToggle from "./ShowEdgesToggle";
import "./Roadmap.css";
import "@xyflow/react/dist/style.css";
import { type Roadmap } from "@customTypes/index";
import Paper from "@mui/material/Paper/Paper";
import useRoadmapSelectsStore from "@store/useRoadmapSelectsStore";
import useBuildRoadmap from "./hooks/useBuildRoadmap";

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

const Roadmap = ({ roadmapData }: { roadmapData: Roadmap }) => {
  const { degree, career, cohort } = useRoadmapSelectsStore();
  const { nodes, edges } = useBuildRoadmap(roadmapData);

  const nodeTypes = useMemo(
    () => ({
      courseNode: CourseNode,
      semesterNode: SemesterNode,
      legendNode: LegendNode,
    }),
    []
  );

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
};

export default Roadmap;
