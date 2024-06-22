import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  Node,
  useNodesState,
  useEdgesState,
} from "reactflow";

import Legend from "./Legend";
import * as RoadmapConstants from "./Roadmap.constants";
import { useMemo, useState, useEffect, useCallback } from "react";
import CourseNode from "./nodes/CourseNode";
import useFetchRoadmap from "./hooks/useFetchRoadmap";
import { buildRoadmap, updateNodesOnCheck } from "./util/buildRoadmap.util";

import "./Roadmap.css";
import "reactflow/dist/style.css";

const legendNode: Node = {
  id: "legendNode",
  position: { x: RoadmapConstants.PARENT_XPOS_START, y: 15 },
  data: {
    label: <Legend />,
  },
  style: {
    width: "max-content",
    fontSize: "1em",
  },
};

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

const calculateRoadmapHeight = (NumOfSemesters: number) =>
  RoadmapConstants.PARENT_YPOS_START +
  (RoadmapConstants.PARENT_NODE_HEIGHT +
    RoadmapConstants.YPOS_BETWEEN_PARENTS) *
    NumOfSemesters;

export default function Roadmap({
  degree,
  career,
  cohort,
}: {
  degree: string;
  career: string;
  cohort: string;
}) {
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [completedCourses, setCompletedCourses] = useState<Set<string>>(() => {
    const storedCompletedCourses = localStorage.getItem("completedCourses");
    return storedCompletedCourses
      ? new Set(JSON.parse(storedCompletedCourses))
      : new Set();
  });
  const { fetchedRoadmapData, error, isLoading } = useFetchRoadmap(
    degree,
    career,
    cohort
  );

  const nodeTypes = useMemo(() => ({ courseNode: CourseNode }), []);

  const handleNodeCheck = useCallback((id: string) => {
    setCompletedCourses((prevCompletedCourses) => {
      const newCompletedCourses = new Set(prevCompletedCourses);
      if (newCompletedCourses.has(id)) {
        newCompletedCourses.delete(id);
      } else {
        newCompletedCourses.add(id);
      }
      localStorage.setItem(
        "completedCourses",
        JSON.stringify(Array.from(newCompletedCourses))
      );
      return newCompletedCourses;
    });
  }, []);

  useEffect(() => {
    if (fetchedRoadmapData) {
      const { nodes, edges } = buildRoadmap(
        fetchedRoadmapData,
        handleNodeCheck,
        completedCourses
      );
      setNodes(nodes);
      setEdges(edges);
    }
  }, [fetchedRoadmapData]); //TODO: fix dependencies

  useEffect(() => {
    const updatedNodes = updateNodesOnCheck(nodes, completedCourses);
    setNodes(updatedNodes);
  }, [completedCourses, setNodes]); //TODO: fix dependencies

  const titleNode = createTitleNode(cohort, degree, career);

  const roadmapHeight = calculateRoadmapHeight(
    Object.keys(fetchedRoadmapData).length
  );

  return (
    <div
      className="flowchart"
      style={{
        height: `${roadmapHeight}px`,
      }}
    >
      {error && <p>{error}</p>}
      {isLoading && <p>Loading...</p>}
      <ReactFlow
        nodes={[legendNode, titleNode, ...nodes]}
        edges={edges}
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls position="top-right" />
        <MiniMap position="bottom-right" />
      </ReactFlow>
    </div>
  );
}
