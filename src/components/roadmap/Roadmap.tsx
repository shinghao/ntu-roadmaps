import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  Node,
  Edge,
  MarkerType,
} from "reactflow";
import roadmapData from "../../data/roadmapdata.json";
import coursesData from "../../data/courses.json";
import Legend from "./Legend";
import * as RoadmapConstants from "./Roadmap.constants";

import "./Roadmap.css";
import "reactflow/dist/style.css";

const legendNode: Node = {
  id: "legendNode",
  position: { x: 15, y: 15 },
  data: {
    label: <Legend />,
  },
  style: {
    width: "max-content",
  },
};

interface Course {
  title: string;
  type: string;
  AU: string | number;
  prerequisites: string[];
}

interface CourseData {
  [courseCode: string]: Course;
}

export default function Roadmap({
  degree,
  career,
  cohort,
}: {
  degree: string;
  career: string;
  cohort: string;
}) {
  const chosenDegreeRoadmap: Record<string, string[]> = roadmapData[degree];
  const typedCourseData: CourseData = coursesData;

  const courseCodes = Object.values(chosenDegreeRoadmap).reduce(
    (prev, cur) => [...prev, ...cur],
    []
  );
  const courses = Object.fromEntries(
    Object.entries(typedCourseData).filter(([courseCode]) =>
      courseCodes.includes(courseCode)
    )
  );

  const parentNodes = generateParentNodes(chosenDegreeRoadmap);
  const parentEdges = generateParentEdges(parentNodes);
  const childNodes = generateChildNodes(chosenDegreeRoadmap, parentNodes);
  const prerequisitesEdges = generateprerequisitesEdges(courses, childNodes);

  const titleNode: Node = {
    id: "titleNode",
    className: "node-title",
    position: { x: 300, y: 30 },
    data: {
      label: <h1>{`${cohort} - ${degree} - ${career}`}</h1>,
    },
    draggable: false,
    selectable: false,
  };

  const edgeFromTitle = {
    id: `${titleNode.id}-${parentNodes[0].id}`,
    source: `${titleNode.id}`,
    target: `${parentNodes[0].id}`,
  };

  const nodes = [legendNode, titleNode, ...parentNodes, ...childNodes];
  const edges = [edgeFromTitle, ...parentEdges, ...prerequisitesEdges];

  const flowchartHeight =
    RoadmapConstants.PARENT_YPOS_START +
    (RoadmapConstants.PARENT_NODE_HEIGHT +
      RoadmapConstants.YPOS_BETWEEN_PARENTS) *
      parentNodes.length;

  return (
    <div
      className="flowchart"
      style={{
        height: `${flowchartHeight}px`,
      }}
    >
      <ReactFlow nodes={nodes} edges={edges}>
        <Background />
        <Controls position="top-right" />
        <MiniMap position="bottom-right" />
      </ReactFlow>
    </div>
  );
}

function generateParentNodes(roadmapData: Record<string, string[]>): Node[] {
  const nodes: Node[] = [];
  const xPos = RoadmapConstants.PARENT_XPOS_START;
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
        // type: "group",
        data: { label: yearSemester },
        position: { x: xPos, y: yPos },
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

function generateChildNodes(
  roadmapData: Record<string, string[]>,
  parentNodes: Node[]
): Node[] {
  const childNodes: Node[] = [];

  Object.values(roadmapData).forEach((courses, parentIndex) => {
    let childNodeX = RoadmapConstants.CHILD_XPOS_START;
    const childNodeY = RoadmapConstants.CHILD_YPOS_START;

    courses.forEach((course, childIndex) => {
      const childNodeId = childNodes.map((child) => child.id).includes(course)
        ? `${parentIndex}-${course}-${childIndex}`
        : `${course}`;

      childNodes.push({
        id: childNodeId,
        data: { label: course },
        position: { x: childNodeX, y: childNodeY },
        parentNode: parentNodes[parentIndex].id,
        extent: "parent",
        style: {
          width: RoadmapConstants.CHILD_NODE_WIDTH,
          height: RoadmapConstants.CHILD_NODE_HEIGHT,
        },
      });

      childNodeX +=
        RoadmapConstants.XPOS_BETWEEN_CHILD + RoadmapConstants.CHILD_NODE_WIDTH;
    });
  });

  return childNodes;
}

function generateParentEdges(parentNodes: Node[]): Edge[] {
  const edges = parentNodes.slice(0, -1).map((sourceNode, index) => {
    const destinationNode = parentNodes[index + 1];
    return {
      id: `${sourceNode.id}-${destinationNode.id}`,
      source: `${sourceNode.id}`,
      target: `${destinationNode.id}`,
      type: "straight",
      style: {
        strokeWidth: 2,
        stroke: "#1C1C62",
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#1C1C62",
      },
    };
  });

  return [];
}

function generateprerequisitesEdges(
  courses: CourseData,
  childNodes: Node[]
): Edge[] {
  const edges: Edge[] = [];
  const childNodesId = childNodes.map((child) => child.id);

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
