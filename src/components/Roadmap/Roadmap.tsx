import {
  ReactFlow,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from "@xyflow/react";

import { useMemo, useEffect, useCallback, useState } from "react";
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
import { Elective, ExportData, type Roadmap } from "@customTypes/index";

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
  degreeType: string;
  selectedElectives: Elective[];
  setSelectedElectives: React.Dispatch<React.SetStateAction<Elective[]>>;
  handleOnOpenCourseModal: (nodeId: string, isElective: boolean) => void;
  onImport: (data: ExportData) => void;
  fetchedRoadmapData: Roadmap;
}

export default function Roadmap({
  degree,
  career,
  cohort,
  degreeType,
  selectedElectives,
  setSelectedElectives,
  handleOnOpenCourseModal,
  onImport,
  fetchedRoadmapData,
}: RoadmapProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgeChange] = useEdgesState<Edge>([]);
  const [isEdgesHidden, setIsEdgesHidden] = useState(false);
  const {
    completedCourses,
    addCompletedCourse,
    resetCompletedCourse,
    removeCompletedCourse,
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
            isHandlesHidden: node.data.id !== selectedCourse,
          },
        }))
      );

      selectedCourse === ""
        ? setEdgesOnUnselectCourse(setEdges, isEdgesHidden)
        : setEdgesOnSelectCourse(setEdges, selectedCourse);
    },
    [setEdges, setNodes, isEdgesHidden]
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
        onSelectCourseNode,
        selectedElectives
      );
      setNodes(nodes);
      setEdges(edges);
    }
  }, [fetchedRoadmapData, onSelectCourseNode, selectedElectives]); //TODO: fix dependencies

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
                isCompleted: isCourseCompleted(node.data.courseCode as string),
              }
            : {}),
        },
      }))
    );
  }, [completedCourses, setNodes]);

  const onShowAllEdges = () => {
    setEdges((currentEdges) =>
      currentEdges.map((edge) => ({
        ...edge,
        hidden: !isEdgesHidden,
        animated: false,
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
    setIsEdgesHidden((prev) => !prev);
  };

  const onReset = () => {
    resetCompletedCourse();
    setSelectedElectives([]);
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

  const titleNode = useMemo(
    () => createTitleNode(cohort, degree, career),
    [career, cohort, degree]
  );

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
          degreeType={degreeType}
          completedCourses={completedCourses}
        />
        <DownloadButton />
        <ResetButton onReset={onReset} />
        <ShowEdgesToggle
          onShowAllEdges={onShowAllEdges}
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
