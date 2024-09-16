import {
  ReactFlow,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  Panel,
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
import ShowEdgesToggle from "./ShowEdgesToggle";
import "./Roadmap.css";
import "@xyflow/react/dist/style.css";
import { useCompletedCourses } from "./hooks/useCompletedCourses";
import { type Roadmap } from "@customTypes/index";

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
  career: string;
  handleOnOpenCourseModal: (nodeId: string, isElective: boolean) => void;
  roadmapData: Roadmap;
}

export default function Roadmap({
  career,
  handleOnOpenCourseModal,
  roadmapData,
}: RoadmapProps) {
  const { cohort, degree } = roadmapData;
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgeChange] = useEdgesState<Edge>([]);
  const [isEdgesHidden, setIsEdgesHidden] = useState(false);
  const { getCompletedCourses, addCompletedCourse, removeCompletedCourse } =
    useCompletedCourses();

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
    if (roadmapData?.coursesByYearSemester.length > 0) {
      const { nodes, edges } = buildRoadmap(
        roadmapData,
        onNodeCheck,
        isEdgesHidden,
        handleOnOpenCourseModal,
        onSelectCourseNode
      );
      setNodes(nodes);
      setEdges(edges);
    }
  }, [roadmapData, onSelectCourseNode]); //TODO: fix dependencies

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
  }, [getCompletedCourses, setNodes]);

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
            <ShowEdgesToggle
              onShowAllEdges={onShowAllEdges}
              isEdgesHidden={isEdgesHidden}
            />
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
