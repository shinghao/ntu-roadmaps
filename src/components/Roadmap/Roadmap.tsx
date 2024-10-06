import {
  ReactFlow,
  Controls,
  Panel,
  useReactFlow,
  getNodesBounds,
  Rect,
} from "@xyflow/react";
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
import { Typography, useMediaQuery, useTheme } from "@mui/material";

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
  const { fitView, fitBounds, setViewport } = useReactFlow();

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

  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    const bounds = getNodesBounds(nodes);
    const calculateZoom = (width: number, height: number, bounds: Rect) => {
      const MIN_ZOOM = 0.4;
      const MAX_ZOOM = 0.7;

      if (!bounds || !bounds.width || !bounds.height) return 1;

      const zoomX = width / bounds.width; // Calculate zoom based on width
      const zoomY = height / bounds.height; // Calculate zoom based on height
      const zoom = Math.min(zoomX, zoomY); // Return the smaller zoom factor to fit

      return Math.max(Math.min(zoom, MAX_ZOOM), MIN_ZOOM);
    };

    const resizeObserver = new ResizeObserver(() => {
      if (reactFlowWrapper.current) {
        const containerWidth = reactFlowWrapper.current.clientWidth;
        const containerHeight = reactFlowWrapper.current.clientHeight;

        // Set the viewport to move all nodes to the top of the layout
        setViewport(
          {
            x: isMobile ? 15 : 30,
            y: isMobile ? 15 : 30,
            zoom: calculateZoom(containerWidth, containerHeight, bounds),
          },
          { duration: 800 }
        );
      }
    });

    if (reactFlowWrapper.current) {
      resizeObserver.observe(reactFlowWrapper.current);
    }

    return () => {
      if (reactFlowWrapper.current) {
        resizeObserver.unobserve(reactFlowWrapper.current);
      }
    };
  }, [fitView, nodes, setViewport, fitBounds, isMobile]);

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
