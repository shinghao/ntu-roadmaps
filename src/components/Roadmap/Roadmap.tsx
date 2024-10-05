import { ReactFlow, Controls, Panel, useReactFlow } from "@xyflow/react";
import { useEffect, useMemo, useRef } from "react";
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

const createTitleNode = (cohort: string, degree: string, career: string) => {
  return {
    id: "titleNode",
    className: "node-title",
    position: { x: 0, y: 0 },
    data: {
      label: (
        <Typography
          variant="h1"
          fontSize={"32px"}
          fontWeight={"bold"}
        >{`AY${cohort} - ${degree} (${career})`}</Typography>
      ),
    },
  };
};

const RoadmapView = ({ roadmapData }: { roadmapData: Roadmap }) => {
  const { degree, career, cohort } = useRoadmapSelectsStore();
  const { nodes, edges } = useBuildRoadmap(roadmapData);
  const { fitView } = useReactFlow();

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

  const reactFlowWrapper = useRef(null);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      fitView({ duration: 800 });
    });

    if (reactFlowWrapper.current) {
      resizeObserver.observe(reactFlowWrapper.current);
    }

    return () => {
      if (reactFlowWrapper.current) {
        resizeObserver.unobserve(reactFlowWrapper.current);
      }
    };
  }, [fitView]);

  return (
    <div>
      <div className="flowchart" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={[titleNode, ...nodes]}
          edges={edges}
          nodeTypes={nodeTypes}
          zoomOnDoubleClick={false}
          fitView
          minZoom={0.2}
        >
          <Panel position="top-right">
            <Controls
              position="top-right"
              style={{ marginTop: "3rem", marginRight: "0" }}
              showInteractive={false}
            />
            <ShowEdgesToggle />
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

export default RoadmapView;
