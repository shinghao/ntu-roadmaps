import { Node, Edge, MarkerType } from "reactflow";
import * as RoadmapConstants from "../Roadmap.constants";
import type { Roadmap } from "@api/index";
import coursesData from "../../../data/courses.json";

function isPrerequisitesCompleted(
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
      const { courseCode } = node.data;
      node.data.isAvailable = isPrerequisitesCompleted(
        courseCode,
        completedCourses
      );
      node.data.isCompleted = completedCourses.has(node.data.id);
    }
    return node;
  });
}

export function buildRoadmap(
  roadmapData: Roadmap,
  handleNodeCheck: (id: string) => void,
  completedCourses: Set<string>,
  isEdgesHidden: boolean,
  handleOnOpenCourseModal: (courseCode: string) => void,
  onSelectCourseNode: (id: string, isSelected: boolean) => void
) {
  const generateSemesterNodes = (): Node[] => {
    const nodes: Node[] = [];
    let yPos = RoadmapConstants.PARENT_YPOS_START;

    Object.entries(roadmapData).forEach(
      ([yearSemester, courses], parentIndex) => {
        const parentNodeId = `${parentIndex}`;

        nodes.push({
          id: parentNodeId,
          type: "semesterNode",
          data: { label: yearSemester, noOfCourses: courses.length },
          position: { x: RoadmapConstants.PARENT_XPOS_START, y: yPos },
          draggable: false,
          selectable: false,
          focusable: false,
          zIndex: -2,
        });
        yPos +=
          RoadmapConstants.YPOS_BETWEEN_PARENTS +
          RoadmapConstants.PARENT_NODE_HEIGHT;
      }
    );

    return nodes;
  };

  const generateCourseNodes = (semesterNodes: Node[]): Node[] => {
    const courseNodes: Node[] = [];

    Object.values(roadmapData).forEach((courses, parentIndex) => {
      let childNodeX = RoadmapConstants.CHILD_XPOS_START;

      courses.forEach((courseCode, childIndex) => {
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
          },
          position: { x: childNodeX, y: RoadmapConstants.CHILD_YPOS_START },
          parentNode: semesterNodes[parentIndex].id,
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
