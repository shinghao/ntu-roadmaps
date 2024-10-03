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
  isPrerequisitesCompleted,
} from "./util/buildRoadmap.util";
import {
  setEdgesOnSelectCourse,
  setEdgesOnUnselectCourse,
} from "./util/selectCourse.util";
import ShowEdgesToggle from "./ShowEdgesToggle";
import "./Roadmap.css";
import "@xyflow/react/dist/style.css";
import { type Roadmap } from "@customTypes/index";
import Paper from "@mui/material/Paper/Paper";
import { useCompletedCoursesStore } from "@store/useCompletedCoursesStore";
import useRoadmapSelectsStore from "@store/useRoadmapSelectsStore";

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
  const [isEdgesHidden, setIsEdgesHidden] = useState(false);

  const { completedCourses, addCompletedCourse, removeCompletedCourse } =
    useCompletedCoursesStore();

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

  useEffect(() => {
    const onNodeCheck = (checked: boolean, courseCode: string) => {
      checked
        ? addCompletedCourse(courseCode)
        : removeCompletedCourse(courseCode);
    };

    if (roadmapData?.coursesByYearSemester.length > 0) {
      const { nodes, edges } = buildRoadmap(
        roadmapData,
        onNodeCheck,
        isEdgesHidden,
        onSelectCourseNode
      );
      setNodes(nodes);
      setEdges(edges);
    }
  }, [
    roadmapData,
    onSelectCourseNode,
    setEdges,
    setNodes,
    isEdgesHidden,
    addCompletedCourse,
    removeCompletedCourse,
  ]);

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
                isCompleted: completedCourses.includes(
                  node.data.courseCode as string
                ),
              }
            : {}),
        },
      }))
    );
  }, [completedCourses, setNodes]);

  const onShowAllEdges = useCallback(() => {
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
  }, [isEdgesHidden, setEdges, setNodes]);

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
              <ShowEdgesToggle
                onShowAllEdges={onShowAllEdges}
                isEdgesHidden={isEdgesHidden}
              />
            </Paper>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
