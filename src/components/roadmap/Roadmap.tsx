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
import { useMemo, useState, useEffect } from "react";
import CourseNode from "./nodes/CourseNode";
import { fetchRoadmap } from "@api/index";
import buildRoadmap from "./util/buildRoadmap.util";

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
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const nodeTypes = useMemo(() => ({ courseNode: CourseNode }), []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetchRoadmap(degree, career, cohort);
        setFetchedRoadmapData(response);
      } catch (error) {
        console.error("Error fetching roadmap data", error);
        setError("Error fetching roadmap data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [degree, career, cohort]);

  useEffect(() => {
    if (fetchedRoadmapData) {
      const { nodes, edges } = buildRoadmap(fetchedRoadmapData);
      setNodes(nodes);
      setEdges(edges);
    }
  }, [fetchedRoadmapData, setNodes, setEdges]);

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
