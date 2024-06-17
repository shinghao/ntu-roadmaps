import ReactFlow, { Controls, Node, Edge, MarkerType, Panel } from "reactflow";
import CourseNode from "../../customNodes/CourseNode";
import roadmapData from "../../data/roadmapdata.json";
import coursesData from "../../data/courses.json";
import "./Roadmap.css";
import RoadmapLegend from "./Legend";
import { useMemo } from "react";

const CHILD_NODE_WIDTH = 600;
const CHILD_NODE_HEIGHT = 50;
const CHILD_YPOS_START = 60;
const CHILD_XPOS_START = 50;
// const XPOS_BETWEEN_CHILD = 10;
const YPOS_BETWEEN_CHILD = 12;

const PARENT_XPOS_START = 100;
const PARENT_YPOS_START = 120;
const YPOS_BETWEEN_PARENTS = 40;

const INITIAL_EDGE_OFFSET = 20;
const EDGE_OFFSET = 10;

const childHeightAndSpace = YPOS_BETWEEN_CHILD + CHILD_NODE_HEIGHT;
const parentWidth = CHILD_XPOS_START + CHILD_NODE_WIDTH + CHILD_XPOS_START;

interface Course {
  title: string;
  type: string;
  AU: string | number;
  prerequisites: string[];
}

interface CourseData {
  [courseCode: string]: Course;
}

const typedCourseData: CourseData = coursesData;

export default function RoadmapFlowchart({
  degree,
  career,
  cohort,
  handleShowModal,
}: {
  degree: string;
  career: string;
  cohort: string;
  handleShowModal: (id: string) => void;
}) {
  const nodeTypes = useMemo(() => ({ courseNode: CourseNode }), []);

  const chosenDegreeRoadmap: Record<string, string[]> = roadmapData[degree];

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
  const childNodes = generateChildNodes(
    chosenDegreeRoadmap,
    parentNodes,
    handleShowModal
  );
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

  const nodes = [titleNode, ...parentNodes, ...childNodes];
  const edges = [edgeFromTitle, ...prerequisitesEdges];

  const flowchartHeight = Object.values(chosenDegreeRoadmap).reduce(
    (accumulator, courses) => {
      return (
        accumulator +
        CHILD_YPOS_START +
        courses.length * childHeightAndSpace +
        YPOS_BETWEEN_PARENTS
      );
    },
    PARENT_YPOS_START * 2
  );

  return (
    <div
      className="flowchart"
      style={{
        height: `${flowchartHeight}px`,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        zoomOnScroll={false}
      >
        <Panel position="top-left">
          <RoadmapLegend />
        </Panel>
        <Controls position="top-right" />
        {/* <MiniMap position="bottom-right" /> */}
      </ReactFlow>
    </div>
  );
}

function generateParentNodes(roadmapData: Record<string, string[]>): Node[] {
  const nodes: Node[] = [];
  const xPos = PARENT_XPOS_START;
  let yPos = PARENT_YPOS_START;

  Object.entries(roadmapData).forEach(
    ([yearSemester, courses], parentIndex) => {
      const parentNodeId = `${parentIndex}`;

      const parentHeight =
        CHILD_YPOS_START +
        courses.length * childHeightAndSpace +
        YPOS_BETWEEN_CHILD;

      nodes.push({
        id: parentNodeId,
        data: { label: yearSemester },
        position: { x: xPos, y: yPos },
        style: {
          width: parentWidth,
          minWidth: "max-content",
          height: parentHeight,
          fontWeight: "bold",
          textAlign: "left",
          padding: "1rem",
          zIndex: -1,
          fontSize: "1em",
          borderColor: "rgb(228 228 231)",
          borderRadius: "0.5rem",
        },
      });
      yPos += YPOS_BETWEEN_PARENTS + parentHeight;
    }
  );

  return nodes;
}

function generateChildNodes(
  roadmapData: Record<string, string[]>,
  parentNodes: Node[],
  handleShowModal: (id: string) => void
): Node[] {
  const childNodes: Node[] = [];

  Object.values(roadmapData).forEach((courses, parentIndex) => {
    const childNodeX = CHILD_XPOS_START;
    let childNodeY = CHILD_YPOS_START;

    courses.forEach((courseCode, childIndex) => {
      const childNodeId = childNodes
        .map((child) => child.id)
        .includes(courseCode)
        ? `${parentIndex}-${courseCode}-${childIndex}`
        : `${courseCode}`;

      childNodes.push({
        id: childNodeId,
        data: {
          courseCode,
          courseName: typedCourseData[courseCode]?.title || "",
          id: childNodeId,
          handleShowModal: () => handleShowModal(childNodeId),
        },
        position: { x: childNodeX, y: childNodeY },
        parentNode: parentNodes[parentIndex].id,
        extent: "parent",
        type: "courseNode",
      });

      childNodeY += YPOS_BETWEEN_CHILD + CHILD_NODE_HEIGHT;
    });
  });

  return childNodes;
}

function generateprerequisitesEdges(
  courses: CourseData,
  childNodes: Node[]
): Edge[] {
  const edges: Edge[] = [];
  const childNodesId = childNodes.map((child) => child.id);
  let curOffset = INITIAL_EDGE_OFFSET;

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
          type: "smoothstep",
          pathOptions: {
            offset: curOffset,
          },
        };
        edges.push(edge);
        curOffset += EDGE_OFFSET;
      }
    });
  }

  return edges;
}
