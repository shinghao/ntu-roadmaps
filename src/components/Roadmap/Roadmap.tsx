import {
  ReactFlow,
  Controls,
  Panel,
  useReactFlow,
  getNodesBounds,
  Rect,
  Edge,
  Node,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import CourseNode from "./nodes/CourseNode";
import SemesterNode from "./nodes/SemesterNode";
import LegendNode from "./nodes/LegendNode";
import ShowEdgesToggle from "./ShowEdgesToggle";
import "./Roadmap.css";
import "@xyflow/react/dist/style.css";
import { type Roadmap } from "@customTypes/index";
import useRoadmapSelectsStore from "@store/useRoadmapSelectsStore";
import { Typography, useMediaQuery, useTheme } from "@mui/material";
import useIsEdgesHiddenStore from "@store/useIsEdgesHiddenStore";
import buildRoadmap from "./util/buildRoadmap";
import { useCompletedCoursesStore } from "@store/useCompletedCoursesStore";
import {
  setEdgesOnUnselectCourse,
  setEdgesOnSelectCourse,
} from "./util/onSelectCourse";

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
  const [nodes, setNodes] = useNodesState<Node>([]);
  const [edges, setEdges] = useEdgesState<Edge>([]);
  const { isEdgesHidden } = useIsEdgesHiddenStore();
  const { completedCourses } = useCompletedCoursesStore();
  const { setViewport } = useReactFlow();

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

  const onSelectCourseNode = useCallback(
    (id: string, isSelected: boolean) => {
      const selectedCourse = isSelected ? id : "";
      setNodes((currentNodes) =>
        currentNodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            isSelected: node.data.id === selectedCourse,
            isHandlesHidden: selectedCourse ? false : isEdgesHidden,
          },
        }))
      );

      selectedCourse === ""
        ? setEdgesOnUnselectCourse(setEdges, isEdgesHidden)
        : setEdgesOnSelectCourse(setEdges, selectedCourse);
    },
    [setEdges, setNodes, isEdgesHidden]
  );

  useEffect(() => {
    if (roadmapData?.coursesByYearSemester.length > 0) {
      const { nodes, edges } = buildRoadmap(
        roadmapData,
        completedCourses,
        isEdgesHidden,
        onSelectCourseNode
      );
      setNodes(nodes);
      setEdges(edges);
    }
  }, [
    roadmapData,
    setEdges,
    setNodes,
    isEdgesHidden,
    completedCourses,
    onSelectCourseNode,
  ]);

  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const prevDimensions = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

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

        // Return early if the dimensions have not changed
        if (
          containerWidth === prevDimensions.current.width &&
          containerHeight === prevDimensions.current.height
        ) {
          return;
        }
        // Update previous demensions
        prevDimensions.current = {
          width: containerWidth,
          height: containerHeight,
        };

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
  }, [nodes, setViewport, isMobile]);

  return (
    <div>
      <div className="flowchart" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={[titleNode, ...nodes]}
          edges={edges}
          nodeTypes={nodeTypes}
          zoomOnDoubleClick={false}
          minZoom={0.2}
        >
          <Panel
            position="top-right"
            style={{
              marginTop: isMobile ? "8px" : "16px",
              marginRight: isMobile ? "8px" : "16px",
            }}
          >
            <Controls
              position="top-right"
              style={{
                marginTop: isMobile ? "40px" : "48px",
                marginRight: "0",
              }}
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
