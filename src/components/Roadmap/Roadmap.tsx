import { ReactFlow, Controls, Panel } from "@xyflow/react";
import { useMemo } from "react";
import CourseNode from "./nodes/CourseNode";
import SemesterNode from "./nodes/SemesterNode";
import LegendNode from "./nodes/LegendNode";
import ShowEdgesToggle from "./ShowEdgesToggle";
import "./Roadmap.css";
import "@xyflow/react/dist/style.css";
import { type Roadmap } from "@customTypes/index";
import useRoadmapSelectsStore from "@store/useRoadmapSelectsStore";
import useBuildRoadmap from "./hooks/useBuildRoadmap";
import { Typography } from "@mui/material";

const RoadmapView = ({ roadmapData }: { roadmapData: Roadmap }) => {
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

  return (
    <div>
      <div className="flowchart">
        <ReactFlow
          nodes={[...nodes]}
          edges={edges}
          nodeTypes={nodeTypes}
          zoomOnDoubleClick={false}
          fitView
        >
          <Controls position="top-right" />
          <Panel>
            <ShowEdgesToggle />
          </Panel>
          <Panel position="top-center">
            <Typography
              variant="h1"
              fontSize={"20px"}
              fontWeight={"bold"}
              align="center"
              marginTop={"8px"}
            >{`AY${cohort} - ${degree} (${career})`}</Typography>{" "}
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

export default RoadmapView;
