import { useReactFlow } from "@xyflow/react";
import { isPrerequisitesCompleted } from "../util/buildRoadmap.util";
import { useCompletedCourses } from "./useCompletedCourses";
import { useEffect } from "react";

const useOnCourseNodeCheck = () => {
  const { addCompletedCourse, removeCompletedCourse, completedCourses } =
    useCompletedCourses();
  const { setNodes } = useReactFlow();

  useEffect(() => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          ...(node.type === "courseNode"
            ? {
                isAvailable: isPrerequisitesCompleted(
                  node.data.courseCode as string
                ),
                isCompleted: completedCourses.includes(
                  node.data.courseCode as string
                ),
              }
            : {}),
        },
      }))
    );
  }, [completedCourses, setNodes]);

  const onNodeCheck = (checked: boolean, courseCode: string) => {
    checked
      ? addCompletedCourse(courseCode)
      : removeCompletedCourse(courseCode);
  };

  return { onNodeCheck };
};

export default useOnCourseNodeCheck;
