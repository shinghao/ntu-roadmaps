import roadmapData from "../data/roadmapdata.json";
import coursesData from "../data/courses.json";

interface RoadmapData {
  [degree: string]: Roadmap;
}

export interface Roadmap {
  [yearsem: string]: string[];
}

export const fetchCourses = async (): Promise<Models.Course[]> => {
  return new Promise((resolve) => resolve(coursesData as Models.Course[]));
};

export const fetchCourseDetails = async (
  courseCode: string
): Promise<Models.Course | null> => {
  const courseData = coursesData as Models.Course[];
  const courseFound =
    courseData.find((course) => course.courseCode === courseCode) || null;
  return new Promise((resolve) => resolve(courseFound));
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
