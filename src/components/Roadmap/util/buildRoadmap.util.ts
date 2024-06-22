import { Node, Edge, MarkerType } from "reactflow";
import * as RoadmapConstants from "../Roadmap.constants";
import type { Roadmap, CourseData } from "@api/index";

import coursesData from "../../../data/courses.json";

function isPrerequisitesCompleted(
  courseCode: string,
  completedCourses = new Set()
): boolean {
  const courses = coursesData as CourseData;
  const course = courses[courseCode];
  if (!course || !course.prerequisites) {
    return true;
  }
  return course.prerequisites.every((prereq) => completedCourses.has(prereq));
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
  completedCourses: Set<string>
) {
  const generateSemesterNodes = (): Node[] => {
    const nodes: Node[] = [];
    let yPos = RoadmapConstants.PARENT_YPOS_START;
    const childWidthAndSpace =
      RoadmapConstants.XPOS_BETWEEN_CHILD + RoadmapConstants.CHILD_NODE_WIDTH;
    const backgroundColors = [
      "beige",
      "lightblue",
      "pink",
      "lightsalmon",
      "lightcoral",
    ];

    Object.entries(roadmapData).forEach(
      ([yearSemester, courses], parentIndex) => {
        const parentNodeId = `${parentIndex}`;
        const parentWidth =
          courses.length * childWidthAndSpace +
          RoadmapConstants.XPOS_BETWEEN_CHILD +
          RoadmapConstants.CHILD_XPOS_START;
        const year = parseInt(yearSemester.split(" ")[1]) - 1;

        nodes.push({
          id: parentNodeId,
          type: "semesterNode",
          data: { label: yearSemester },
          position: { x: RoadmapConstants.PARENT_XPOS_START, y: yPos },
          style: {
            width: parentWidth,
            minWidth: "max-content",
            height: RoadmapConstants.PARENT_NODE_HEIGHT,
            backgroundColor: backgroundColors[year],
            fontWeight: "bold",
            textAlign: "left",
            margin: "0 auto",
            zIndex: -1,
            fontSize: "0.8em",
          },
          draggable: false,
          selectable: false,
          focusable: false,
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
          },
          position: { x: childNodeX, y: RoadmapConstants.CHILD_YPOS_START },
          parentNode: semesterNodes[parentIndex].id,
          extent: "parent",
          type: "courseNode",
          draggable: false,
          connectable: false,
          zIndex: 1,
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
    const courseNodesId = courseNodes.map((child) => child.id);
    const courses = coursesData as CourseData;

    for (const [courseCode, { prerequisites }] of Object.entries(courses)) {
      prerequisites.forEach((prereq) => {
        if (courseNodesId.includes(prereq)) {
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
          };
          edges.push(edge);
        }
      });
    }

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
