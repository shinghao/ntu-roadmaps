import { useReactFlow } from "@xyflow/react";
import { useCompletedCoursesStore } from "@store/useCompletedCoursesStore";
import isPrerequisitesCompleted from "@utils/isPrerequisitesCompleted";

const useOnCheckCourseNode = () => {
  const { addCompletedCourse, removeCompletedCourse, completedCourses } =
    useCompletedCoursesStore();
  const { setNodes } = useReactFlow();

  const onNodeCheck = (checked: boolean, courseCode: string) => {
    const updatedCompletedCourses = checked
      ? [...completedCourses, courseCode]
      : completedCourses.filter((code) => code !== courseCode);

    checked
      ? addCompletedCourse(courseCode)
      : removeCompletedCourse(courseCode);

    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          ...(node.type === "courseNode"
            ? {
                isAvailable: isPrerequisitesCompleted(
                  node.data.prerequisites as string[]
                ),
                isCompleted: updatedCompletedCourses.includes(
                  node.data.courseCode as string
                ),
              }
            : {}),
        },
      }))
    );
  };

  return { onNodeCheck };
};

export default useOnCheckCourseNode;
