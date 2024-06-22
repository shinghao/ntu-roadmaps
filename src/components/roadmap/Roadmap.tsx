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
import { fetchRoadmap } from "@api/index";
import { buildRoadmap, updateNodeAvailability } from "./util/buildRoadmap.util";

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

const getTitleNode = (cohort: string, degree: string, career: string) => {
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

const getRoadmapHeight = (NumOfSemesters: number) =>
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
  const [fetchedRoadmapData, setFetchedRoadmapData] = useState({});
  const [completedCourses, setCompletedCourses] = useState<Set<string>>(
    new Set()
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const nodeTypes = useMemo(() => ({ courseNode: CourseNode }), []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const roadmapResponse = await fetchRoadmap(degree, career, cohort);
        setFetchedRoadmapData(roadmapResponse);
      } catch (error) {
        console.error("Error fetching roadmap data", error);
        setError("Error fetching roadmap data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [degree, career, cohort]);

  const handleNodeCheck = useCallback((id: string) => {
    setCompletedCourses((prevCompletedCourses) => {
      const newCompletedCourses = new Set(prevCompletedCourses);
      if (newCompletedCourses.has(id)) {
        newCompletedCourses.delete(id);
      } else {
        newCompletedCourses.add(id);
      }
      return newCompletedCourses;
    });
  }, []);

  useEffect(() => {
    if (fetchedRoadmapData) {
      const { nodes, edges } = buildRoadmap(
        fetchedRoadmapData,
        handleNodeCheck
      );
      setNodes(nodes);
      setEdges(edges);
      console.log("useEffect2");
    }
  }, [fetchedRoadmapData]); //TODO: fix dependencies

  useEffect(() => {
    const updatedNodes = updateNodeAvailability(nodes, completedCourses);
    setNodes(updatedNodes);
    console.log(updatedNodes);
  }, [completedCourses, setNodes]); //TODO: fix dependencies

  const titleNode = getTitleNode(cohort, degree, career);

  const roadmapHeight = getRoadmapHeight(
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
