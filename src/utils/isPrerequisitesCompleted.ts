import coursesData from "../data/courses.json";
import { Course } from "@customTypes/index";
import { getCompletedCourses } from "@store/useCompletedCoursesStore";

const isPrerequisitesCompleted = (courseCode: string) => {
  const completedCourses = getCompletedCourses();
  const courses = coursesData as Course[];
  const course =
    courses.find((course) => course.courseCode === courseCode) || null;
  if (!course || !course.prerequisites) {
    return true;
  }
  // Check each set of prerequisites (OR conditions)
  return course.prerequisites.every((prereqGroup) =>
    prereqGroup.some((prereq) => completedCourses.includes(prereq))
  );
};

export default isPrerequisitesCompleted;
