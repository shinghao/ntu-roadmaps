import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from "@xyflow/react";

import * as RoadmapConstants from "./Roadmap.constants";
import { useMemo, useState, useEffect, useCallback } from "react";
import CourseNode from "./nodes/CourseNode";
import SemesterNode from "./nodes/SemesterNode";
import LegendNode from "./nodes/LegendNode";
import useFetchRoadmap from "./hooks/useFetchRoadmap";
import {
  buildRoadmap,
  isCourseCompleted,
  isPrerequisitesCompleted,
} from "./util/buildRoadmap.util";
import {
  setEdgesOnSelectCourse,
  setEdgesOnUnselectCourse,
} from "./util/selectCourse.util";
import DownloadButton from "./DownloadButton";
import ExportButton from "./ExportButton";
import ImportButton from "./ImportButton";
import ResetButton from "./ResetButton";
import ShowEdgesToggle from "./ShowEdgesToggle";

import { Stack } from "@mui/material";
import "./Roadmap.css";
import "@xyflow/react/dist/style.css";
import { useCompletedCourses } from "./hooks/useCompletedCourses";

const legendNode: Node = {
  id: "legendNode",
  position: { x: RoadmapConstants.PARENT_XPOS_START, y: 15 },
  data: {},
  draggable: false,
  selectable: false,
  type: "legendNode",
};

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

const calculateRoadmapHeight = (NumOfSemesters: number) =>
  RoadmapConstants.PARENT_YPOS_START +
  (RoadmapConstants.PARENT_NODE_HEIGHT +
    RoadmapConstants.YPOS_BETWEEN_PARENTS) *
    NumOfSemesters;

export default function Roadmap({
  degree,
  career,
  cohort,
  handleOnOpenCourseModal,
  updateSelects,
  isEdgesHidden,
  setIsEdgesHidden,
}: {
  degree: string;
  career: string;
  cohort: string;
  handleOnOpenCourseModal: (nodeId: string, isElective: boolean) => void;
  updateSelects: (degree: string, career: string, cohort: string) => void;
  isEdgesHidden: boolean;
  setIsEdgesHidden: (hidden: boolean) => void;
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgeChange] = useEdgesState<Edge>([]);
  const {
    completedCourses,
    addCompletedCourse,
    resetCompletedCourse,
    removeCompletedCourse,
    importCompletedCourses,
  } = useCompletedCourses();

  const { fetchedRoadmapData, error, isLoading } = useFetchRoadmap(
    degree,
    cohort
  );
  const [selectedCourse, setSelectedCourse] = useState("");

  const nodeTypes = useMemo(
    () => ({
      courseNode: CourseNode,
      semesterNode: SemesterNode,
      legendNode: LegendNode,
    }),
    []
  );

  const onSelectCourseNode = useCallback((id: string, isSelected: boolean) => {
    setSelectedCourse(isSelected ? id : "");
  }, []);

  const onNodeCheck = useCallback(
    (checked: boolean, courseCode: string) => {
      checked
        ? addCompletedCourse(courseCode)
        : removeCompletedCourse(courseCode);
    },
    [addCompletedCourse, removeCompletedCourse]
  );

  useEffect(() => {
    if (fetchedRoadmapData) {
      const { nodes, edges } = buildRoadmap(
        fetchedRoadmapData,
        onNodeCheck,
        isEdgesHidden,
        handleOnOpenCourseModal,
        onSelectCourseNode
      );
      setNodes(nodes);
      setEdges(edges);
    }
  }, [fetchedRoadmapData]); //TODO: fix dependencies

  useEffect(() => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          ...(node.type === "courseNode"
            ? {
                isAvailable: isPrerequisitesCompleted(
                  node.data.courseCode as string
                ),
                isCompleted: isCourseCompleted(node.id),
              }
            : {}),
        },
      }))
    );
  }, [completedCourses]);

  useEffect(() => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isSelected: node.data.id === selectedCourse,
        },
      }))
    );

    selectedCourse === ""
      ? setEdgesOnUnselectCourse(setEdges)
      : setEdgesOnSelectCourse(setEdges, selectedCourse);
  }, [selectedCourse]); //TODO: fix dependencies

  const handleOnShowAllEdges = () => {
    console.log(edges, nodes);
    setEdges((currentEdges) =>
      currentEdges.map((edge) => ({
        ...edge,
        hidden: !isEdgesHidden,
      }))
    );
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isHandlesHidden: !isEdgesHidden,
          isSelected: false,
        },
      }))
    );
    setIsEdgesHidden(!isEdgesHidden);
  };

  const onImport = (data: {
    degree: string;
    career: string;
    cohort: string;
    completedCourses: string[];
  }) => {
    updateSelects(data.degree, data.career, data.cohort);
    importCompletedCourses(data.completedCourses);
  };

  const onReset = () => {
    resetCompletedCourse();
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isSelected: false,
        },
      }))
    );
    setEdges((currentEdges) =>
      currentEdges.map((edge) => ({
        ...edge,
        hidden: false,
        animated: false,
      }))
    );
  };

  const titleNode = createTitleNode(cohort, degree, career);
  const roadmapHeight = calculateRoadmapHeight(
    Object.keys(fetchedRoadmapData.coursesByYearSemester).length
  );

  if (error) {
    return <p>{`Error: ${error}. Please try again`}</p>;
  }

  return (
    <div>
      <Stack spacing={2} direction="row" flexWrap="wrap" useFlexGap marginY={4}>
        <ImportButton onImport={onImport} />
        <ExportButton
          degree={degree}
          career={career}
          cohort={cohort}
          completedCourses={completedCourses}
        />
        <DownloadButton />
        <ResetButton onReset={onReset} />
        <ShowEdgesToggle
          handleOnShowAllEdges={handleOnShowAllEdges}
          isEdgesHidden={isEdgesHidden}
        />
      </Stack>
      <div
        className="flowchart"
        style={{
          height: `${roadmapHeight}px`,
        }}
      >
        {isLoading && <p>Loading...</p>}
        <ReactFlow
          nodes={[legendNode, titleNode, ...nodes]}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgeChange}
        >
          <Background />
          <Controls position="top-right" />
        </ReactFlow>
      </div>
    </div>
  );
}
