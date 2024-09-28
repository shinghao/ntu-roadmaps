import { Node, Edge, MarkerType } from "@xyflow/react";
import * as RoadmapConstants from "../Roadmap.constants";
import coursesData from "../../../data/courses.json";
import { Course, CourseInRoadmapType, Roadmap } from "@customTypes/index";
import { getCompletedCourses } from "@store/useCompletedCoursesStore";

export function isPrerequisitesCompleted(courseCode: string): boolean {
  const completedCourses = getCompletedCourses();
  const courses = coursesData as Course[];
  const course =
    courses.find((course) => course.courseCode === courseCode) || null;
  if (!course || !course.prerequisites) {
    return true;
  }
  // Check each set of prerequisites (OR conditions)
  return course.prerequisites.every((prereqGroup) =>
    prereqGroup.some((prereq) => completedCourses.includes(prereq))
  );
}

export function updateNodesOnCheck(nodes: Node[]) {
  const completedCourses = getCompletedCourses();
  return nodes.map((node) => {
    if (node.type === "courseNode") {
      node.data.isAvailable = isPrerequisitesCompleted(
        node.data.courseCode as string
      );
      node.data.isCompleted = completedCourses.includes(
        node.data.courseCode as string
      );
    }
    return node;
  });
}

export const updateCourseNodesForHandles = (
  courseNodes: Node[],
  edges: Edge[]
): Node[] => {
  return courseNodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      hasSourceHandle: edges.some(({ source }) => node.id === source),
      hasTargetHandle: edges.some(({ target }) => node.id === target),
    },
  }));
};

export function buildRoadmap(
  roadmapData: Roadmap,
  onNodeCheck: (checked: boolean, courseCode: string) => void,
  isEdgesHidden: boolean,
  handleOnOpenCourseModal: (nodeId: string, isElective: boolean) => void,
  onSelectCourseNode: (id: string, isSelected: boolean) => void
) {
  const generateSemesterNodes = (): Node[] => {
    const nodes: Node[] = [];
    let yPos = RoadmapConstants.PARENT_YPOS_START;
    roadmapData.coursesByYearSemester.forEach(({ year, semester, courses }) => {
      const label = `YEAR ${year} SEMESTER ${semester}`;
      const id = label;

      const node = {
        id,
        type: "semesterNode",
        data: { label, noOfCourses: courses.length },
        position: { x: RoadmapConstants.PARENT_XPOS_START, y: yPos },
        draggable: false,
        selectable: false,
        focusable: false,
        zIndex: -2,
      };
      yPos +=
        RoadmapConstants.YPOS_BETWEEN_PARENTS +
        RoadmapConstants.PARENT_NODE_HEIGHT;

      nodes.push(node);
    });

    return nodes;
  };

  const generateCourseNodes = (semesterNodes: Node[]): Node[] => {
    const courseNodes: Node[] = [];
    const completedCourses = getCompletedCourses();

    roadmapData.coursesByYearSemester.forEach(({ courses }, parentIndex) => {
      let childNodeX = RoadmapConstants.CHILD_XPOS_START;

      courses.forEach(({ courseCode, prerequisites, type, id }) => {
        const isElective = type === CourseInRoadmapType.Elective;

        courseNodes.push({
          id,
          data: {
            id,
            courseCode,
            prerequisites,
            onCheck: onNodeCheck,
            isHandlesHidden: isEdgesHidden,
            isAvailable: completedCourses.includes(courseCode),
            handleOnOpenCourseModal,
            onSelectCourseNode,
            isElective,
          },
          position: { x: childNodeX, y: RoadmapConstants.CHILD_YPOS_START },
          parentId: semesterNodes[parentIndex].id,
          extent: "parent",
          type: "courseNode",
          draggable: false,
          connectable: false,
          zIndex: 10,
        });

        childNodeX +=
          RoadmapConstants.XPOS_BETWEEN_CHILD +
          RoadmapConstants.CHILD_NODE_WIDTH;
      });
    });

    return courseNodes;
  };

  const generateEdges = (courseNodes: Node[]): Edge[] => {
    const edges: Edge[] = [];
    const coursesInRoadmapMap = new Map(
      courseNodes.map((courseNode) => [
        courseNode.data.courseCode,
        {
          id: courseNode.data.id as string,
          courseCode: courseNode.data.courseCode as string,
          prerequisites: courseNode.data.prerequisites as string[],
        },
      ])
    );

    coursesInRoadmapMap.forEach(({ prerequisites, id }) => {
      prerequisites.forEach((prerequisite) => {
        const prerequisiteInRoadmap = coursesInRoadmapMap.get(prerequisite);
        if (!prerequisiteInRoadmap) {
          return;
        }
        const source = prerequisiteInRoadmap.id;
        const target = id;
        const edge = CreateNewEdge(source, target, isEdgesHidden);
        edges.push(edge);
      });
    });

    return edges;
  };

  const semesterNodes = generateSemesterNodes();
  const courseNodes = generateCourseNodes(semesterNodes);
  const edges = generateEdges(courseNodes);
  const updatedCourseNodes = updateCourseNodesForHandles(courseNodes, edges);

  const nodes = [...semesterNodes, ...updateNodesOnCheck(updatedCourseNodes)];

  return { nodes, edges };
}

export const CreateNewEdge = (
  source: string,
  target: string,
  isEdgesHidden: boolean
) => ({
  id: `${source}-${target}`,
  source,
  target,
  style: {
    stroke: "#2B78E4",
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "#2B78E4",
  },
  hidden: isEdgesHidden,
  zIndex: 1,
});
