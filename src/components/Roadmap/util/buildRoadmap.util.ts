import { Node, Edge, MarkerType } from "reactflow";
import * as RoadmapConstants from "../Roadmap.constants";
import type { Roadmap, CourseData } from "@api/index";

import coursesData from "../../../data/courses.json";

function generateParentNodes(roadmapData: Record<string, string[]>): Node[] {
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
        type: "default",
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
        },
      });
      yPos +=
        RoadmapConstants.YPOS_BETWEEN_PARENTS +
        RoadmapConstants.PARENT_NODE_HEIGHT;
    }
  );

  return nodes;
}

function generateChildNodes(roadmapData: Roadmap, parentNodes: Node[]): Node[] {
  const childNodes: Node[] = [];

  Object.values(roadmapData).forEach((courses, parentIndex) => {
    let childNodeX = RoadmapConstants.CHILD_XPOS_START;

    courses.forEach((courseCode, childIndex) => {
      const childNodeId = childNodes
        .map((child) => child.id)
        .includes(courseCode)
        ? `${parentIndex}-${courseCode}-${childIndex}`
        : `${courseCode}`;

      childNodes.push({
        id: childNodeId,
        data: { courseCode, id: childNodeId },
        position: { x: childNodeX, y: RoadmapConstants.CHILD_YPOS_START },
        parentNode: parentNodes[parentIndex].id,
        extent: "parent",
        type: "courseNode",
      });

      childNodeX +=
        RoadmapConstants.XPOS_BETWEEN_CHILD + RoadmapConstants.CHILD_NODE_WIDTH;
    });
  });

  return childNodes;
}

function generateprerequisitesEdges(childNodes: Node[]): Edge[] {
  const edges: Edge[] = [];
  const childNodesId = childNodes.map((child) => child.id);
  const courses = coursesData as CourseData;

  for (const [courseCode, { prerequisites }] of Object.entries(courses)) {
    prerequisites.forEach((prereq) => {
      if (childNodesId.includes(prereq)) {
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
}

export default function buildRoadmap(roadmapData: Roadmap) {
  const parentNodes = generateParentNodes(roadmapData);
  const childNodes = generateChildNodes(roadmapData, parentNodes);

  const nodes = [...parentNodes, ...childNodes];
  const edges = generateprerequisitesEdges(childNodes);

  return { nodes, edges };
}
