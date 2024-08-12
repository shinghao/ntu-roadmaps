/* Reconnect edges in roadmap */

import { useReactFlow, Edge } from "@xyflow/react";
import {
  CreateNewEdge,
  updateCourseNodesForHandles,
} from "../util/buildRoadmap.util";
import { type CourseNodeData } from "../nodes/CourseNode";

export const useUpdateNodeData = () => {
  const { getNodes, setNodes, setEdges } = useReactFlow();

  const updateNodeData = (
    nodeId: string,
    updatedData: Partial<CourseNodeData>,
    isEdgesHidden: boolean
  ) => {
    const nodes = getNodes();

    const updatedNodes = nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        hasSourceHandle: true,
        hasTargetHandle: true,
        ...(node.id === nodeId ? updatedData : {}),
      },
    }));

    const coursesInRoadmap = updatedNodes
      .filter((node) => node.type === "courseNode")
      .map(({ data, id }) => ({
        id,
        courseCode: data.courseCode as string,
        prerequisites: (data.prerequisites as string[][]).flat(),
      }));

    const updatedEdges = coursesInRoadmap
      .flatMap(({ courseCode, prerequisites }) =>
        prerequisites.reduce<Edge[]>((acc, prerequisite) => {
          const source = updatedNodes.find(
            (node) => node.data.courseCode === prerequisite
          )?.id;
          const target = updatedNodes.find(
            (node) => node.data.courseCode === courseCode
          )?.id;

          return [
            ...acc,
            ...(source && target
              ? [CreateNewEdge(source, target, isEdgesHidden)]
              : []),
          ];
        }, [])
      )
      .filter((edge) => edge !== null);

    const nodesWithUpdatedHandles = updateCourseNodesForHandles(
      updatedNodes,
      updatedEdges
    );

    setNodes(nodesWithUpdatedHandles);
    setEdges(updatedEdges);
  };

  return { updateNodeData };
};
