import {
  ReactFlow,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from "@xyflow/react";

import { useMemo, useEffect, useCallback } from "react";
import CourseNode from "./nodes/CourseNode";
import SemesterNode from "./nodes/SemesterNode";
import LegendNode from "./nodes/LegendNode";
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
  degree: string;
  career: string;
  cohort: string;
  handleOnOpenCourseModal: (nodeId: string, isElective: boolean) => void;
  updateSelects: (degree: string, career: string, cohort: string) => void;
  isEdgesHidden: boolean;
  setIsEdgesHidden: (hidden: boolean) => void;
  fetchedRoadmapData: Models.Roadmap;
}

export default function Roadmap({
  degree,
  career,
  cohort,
  handleOnOpenCourseModal,
  updateSelects,
  isEdgesHidden,
  setIsEdgesHidden,
  fetchedRoadmapData,
}: RoadmapProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgeChange] = useEdgesState<Edge>([]);
  const {
    completedCourses,
    addCompletedCourse,
    resetCompletedCourse,
    removeCompletedCourse,
    importCompletedCourses,
  } = useCompletedCourses();

  const nodeTypes = useMemo(
    () => ({
      courseNode: CourseNode,
      semesterNode: SemesterNode,
      legendNode: LegendNode,
    }),
    []
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
          },
        }))
      );

      selectedCourse === ""
        ? setEdgesOnUnselectCourse(setEdges)
        : setEdgesOnSelectCourse(setEdges, selectedCourse);
    },
    [setEdges, setNodes]
  );

  const onNodeCheck = useCallback(
    (checked: boolean, courseCode: string) => {
      checked
        ? addCompletedCourse(courseCode)
        : removeCompletedCourse(courseCode);
    },
    [addCompletedCourse, removeCompletedCourse]
  );

  useEffect(() => {
    if (fetchedRoadmapData?.coursesByYearSemester.length > 0) {
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
  }, [completedCourses, setNodes]);

  const handleOnShowAllEdges = () => {
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

  return (
    <div>
      <Stack
        spacing={2}
        direction="row"
        flexWrap="wrap"
        useFlexGap
        marginY={4}
        alignItems={"center"}
      >
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
        </ReactFlow>
      </div>
    </div>
  );
}
