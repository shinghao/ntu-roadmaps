import roadmapData from "../data/roadmapdata.json";
import coursesData from "../data/courses.json";

interface Course {
  title: string;
  type: string;
  AU: number;
  prerequisites: string[];
}

export interface CourseData {
  [courseCode: string]: Course;
}

interface RoadmapData {
  [degree: string]: Roadmap;
}

export interface Roadmap {
  [yearsem: string]: string[];
}

export const fetchCourses = async (): Promise<CourseData> => {
  return new Promise((resolve) => resolve(coursesData as CourseData));
};

export const fetchCourseDetails = async (
  courseCode: string
): Promise<Course> => {
  const courseData = coursesData as CourseData;
  return new Promise((resolve) => resolve(courseData[courseCode]));
};

export const fetchRoadmap = async (
  degree: string,
  career: string,
  cohort: string
): Promise<Roadmap> => {
  console.log(degree, career, cohort);
  const roadmap = roadmapData as RoadmapData;
  return new Promise((resolve) => resolve(roadmap[degree]));
};
