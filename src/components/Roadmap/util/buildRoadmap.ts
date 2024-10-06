import { Edge, MarkerType, Node } from "@xyflow/react";
import isPrerequisitesCompleted from "@utils/isPrerequisitesCompleted";
import * as RoadmapConstants from "../Roadmap.constants";
import { Roadmap } from "@customTypes/index";

const updateCourseNodesForHandles = (
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

const CreateNewEdge = (
  source: string,
  target: string,
  isEdgesHidden: boolean
) => ({
  id: `${source}-${target}`,
  source,
  target,
  style: {
    stroke: "#2B78E4",
    strokeWidth: 2,
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "#2B78E4",
  },
  hidden: isEdgesHidden,
  zIndex: 1,
});

const buildRoadmap = (
  roadmapData: Roadmap,
  completedCourses: string[],
  isEdgesHidden: boolean,
  onSelectCourseNode: (id: string, isSelected: boolean) => void
) => {
  const updateNodesOnCheck = (nodes: Node[]) => {
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
  };

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

      courses.forEach(({ courseCode, prerequisites, type, id, title }) => {
        courseNodes.push({
          id,
          data: {
            id,
            courseCode,
            prerequisites,
            isHandlesHidden: isEdgesHidden,
            isAvailable: completedCourses.includes(courseCode),
            courseType: type,
            title,
            onSelectCourseNode,
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
};

export default buildRoadmap;
