import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  Node,
  useNodesState,
  useEdgesState,
} from "reactflow";

import * as RoadmapConstants from "./Roadmap.constants";
import { useMemo, useState, useEffect, useCallback } from "react";
import CourseNode from "./nodes/CourseNode";
import SemesterNode from "./nodes/SemesterNode";
import LegendNode from "./nodes/LegendNode";
import useFetchRoadmap from "./hooks/useFetchRoadmap";
import { buildRoadmap, updateNodesOnCheck } from "./util/buildRoadmap.util";
import {
  setEdgesOnSelectCourse,
  setEdgesOnUnselectCourse,
} from "./util/selectCourse.util";
import DownloadButton from "./DownloadButton";
import ExportButton from "./ExportButton";
import ImportButton from "./ImportButton";
import ResetButton from "./ResetButton";
import ShowEdgesToggle from "./ShowEdgesToggle";

import { Stack } from "@mui/material";
import "./Roadmap.css";
import "reactflow/dist/style.css";

const legendNode: Node = {
  id: "legendNode",
  position: { x: RoadmapConstants.PARENT_XPOS_START, y: 15 },
  data: {},
  draggable: false,
  selectable: false,
  type: "legendNode",
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
  handleOnOpenCourseModal,
  updateSelects,
}: {
  degree: string;
  career: string;
  cohort: string;
  handleOnOpenCourseModal: (courseCode: string) => void;
  updateSelects: (degree: string, career: string, cohort: string) => void;
}) {
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [completedCourses, setCompletedCourses] = useState<Set<string>>(() => {
    const storedCompletedCourses = localStorage.getItem("completedCourses");
    return storedCompletedCourses
      ? new Set(JSON.parse(storedCompletedCourses))
      : new Set();
  });
  const [isEdgesHidden, setisEdgesHidden] = useState(false);
  const { fetchedRoadmapData, error, isLoading } = useFetchRoadmap(
    degree,
    career,
    cohort
  );
  const [selectedCourse, setSelectedCourse] = useState("");

  const nodeTypes = useMemo(
    () => ({
      courseNode: CourseNode,
      semesterNode: SemesterNode,
      legendNode: LegendNode,
    }),
    []
  );

  const onSelectCourseNode = useCallback((id: string, isSelected: boolean) => {
    setSelectedCourse(isSelected ? id : "");
  }, []);

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
        completedCourses,
        isEdgesHidden,
        handleOnOpenCourseModal,
        onSelectCourseNode
      );
      setNodes(nodes);
      setEdges(edges);
    }
  }, [fetchedRoadmapData]); //TODO: fix dependencies

  useEffect(() => {
    const updatedNodes = updateNodesOnCheck(nodes, completedCourses);
    setNodes(updatedNodes);
  }, [completedCourses, setNodes]); //TODO: fix dependencies

  useEffect(() => {
    const updatedNodes = nodes.map((node) => {
      node.data.isSelected = node.data.id === selectedCourse;
      return node;
    });
    setNodes(updatedNodes);

    selectedCourse === ""
      ? setEdgesOnUnselectCourse(edges, setEdges)
      : setEdgesOnSelectCourse(edges, setEdges, selectedCourse);
  }, [selectedCourse]); //TODO: fix dependencies

  const handleOnShowAllEdges = () => {
    const updatedEdges = edges.map((edge) => {
      edge.hidden = !isEdgesHidden;
      return edge;
    });
    const updatedNodes = nodes.map((node) => {
      node.data.isHandlesHidden = !isEdgesHidden;
      node.data.isSelected = false;
      return node;
    });
    setEdges(updatedEdges);
    setNodes(updatedNodes);
    setisEdgesHidden(!isEdgesHidden);
  };

  const onImport = (data: {
    degree: string;
    career: string;
    cohort: string;
    completedCourses: string[];
  }) => {
    localStorage.setItem(
      "completedCourses",
      JSON.stringify(data.completedCourses)
    );
    updateSelects(data.degree, data.career, data.cohort);
    setCompletedCourses(new Set(data.completedCourses));
  };

  const onReset = () => {
    localStorage.setItem("completedCourses", JSON.stringify([]));
    setCompletedCourses(new Set([]));
    setNodes(
      nodes.map((node) => {
        node.data.isSelected = false;
        return node;
      })
    );
    setEdges(
      edges.map((edge) => {
        edge.hidden = edge.animated = false;
        return edge;
      })
    );
  };

  const titleNode = createTitleNode(cohort, degree, career);
  const roadmapHeight = calculateRoadmapHeight(
    Object.keys(fetchedRoadmapData).length
  );

  return (
    <div>
      <Stack spacing={2} direction="row" flexWrap="wrap" useFlexGap marginY={4}>
        <ImportButton onImport={onImport} />
        <ExportButton
          degree={degree}
          career={career}
          cohort={cohort}
          completedCourses={[...completedCourses]}
        />
        <DownloadButton nodes={nodes} />
        <ResetButton onReset={onReset} />
        <ShowEdgesToggle
          handleOnShowAllEdges={handleOnShowAllEdges}
          isEdgesHidden={isEdgesHidden}
        />
      </Stack>
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
    </div>
  );
}
