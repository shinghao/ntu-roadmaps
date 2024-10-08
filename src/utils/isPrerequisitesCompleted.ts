import { getCompletedCourses } from "@store/useCompletedCoursesStore";

const isPrerequisitesCompleted = (prerequisites: string[]) => {
  const completedCourses = getCompletedCourses();

  return prerequisites.every((prereq) => completedCourses.includes(prereq));
};

export default isPrerequisitesCompleted;
