import { Node, Edge, MarkerType } from "@xyflow/react";
import * as RoadmapConstants from "../Roadmap.constants";
import coursesData from "../../../data/courses.json";

export function isPrerequisitesCompleted(
  courseCode: string,
  completedCourses = new Set()
): boolean {
  const courses = coursesData as Models.Course[];
  const course =
    courses.find((course) => course.courseCode === courseCode) || null;
  if (!course || !course.prerequisites) {
    return true;
  }
  // Check each set of prerequisites (OR conditions)
  return course.prerequisites.every((prereqGroup) =>
    prereqGroup.some((prereq) => completedCourses.has(prereq))
  );
}

export function updateNodesOnCheck(
  nodes: Node[],
  completedCourses: Set<string>
) {
  return nodes.map((node) => {
    if (node.type === "courseNode") {
      node.data.isAvailable = isPrerequisitesCompleted(
        node.data.courseCode as string,
        completedCourses
      );
      node.data.isCompleted = completedCourses.has(node.id);
    }
    return node;
  });
}

export function buildRoadmap(
  roadmapData: Models.Roadmap,
  handleNodeCheck: (id: string) => void,
  completedCourses: Set<string>,
  isEdgesHidden: boolean,
  handleOnOpenCourseModal: (courseCode: string, isElective: boolean) => void,
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

    roadmapData.coursesByYearSemester.forEach(({ courses }, parentIndex) => {
      let childNodeX = RoadmapConstants.CHILD_XPOS_START;

      courses.forEach(({ courseCode }, childIndex) => {
        const childNodeId = courseNodes
          .map((child) => child.id)
          .includes(courseCode)
          ? `${parentIndex}-${courseCode}-${childIndex}`
          : `${courseCode}`;

        courseNodes.push({
          id: childNodeId,
          data: {
            courseCode,
            id: childNodeId,
            onCheck: handleNodeCheck,
            isHandlesHidden: isEdgesHidden,
            handleOnOpenCourseModal,
            onSelectCourseNode,
            isElective: childNodeId.includes("xxx"),
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
    const coursesInRoadmap = courseNodes.map((child) => child.data.courseCode);
    const courses = coursesData as Models.Course[];

    courses.forEach(({ prerequisites, courseCode }) => {
      prerequisites?.flatMap((prereqGroup) =>
        prereqGroup.forEach((prereq) => {
          if (coursesInRoadmap.includes(prereq)) {
            const source = prereq;
            const target = courseCode;
            const edge = {
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
            };
            edges.push(edge);
          }
        })
      );
    });

    return edges;
  };

  const updateCourseNodesForHandles = (
    courseNodes: Node[],
    edges: Edge[]
  ): Node[] => {
    return courseNodes.map((node) => {
      node.data.hasSourceHandle = edges.some(
        ({ source }) => node.id === source
      );
      node.data.hasTargetHandle = edges.some(
        ({ target }) => node.id === target
      );
      return node;
    });
  };

  const semesterNodes = generateSemesterNodes();
  const courseNodes = generateCourseNodes(semesterNodes);
  const edges = generateEdges(courseNodes);
  const updatedCourseNodes = updateCourseNodesForHandles(courseNodes, edges);

  const nodes = [
    ...semesterNodes,
    ...updateNodesOnCheck(updatedCourseNodes, completedCourses),
  ];

  return { nodes, edges };
}
