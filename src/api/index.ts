import roadmapData from "../data/roadmapdata.json";
import coursesData from "../data/courses.json";
import degreeProgrammes from "../data/degreeProgrammes.json";
import careers from "../data/careers.json";
import {
  type Career,
  type Course,
  CourseInRoadmapType,
  type GetDegreeProgrammesResp,
  type Roadmap,
} from "@customTypes/index";

export const fetchCourses = async (): Promise<Course[]> => {
  return new Promise((resolve) => resolve(coursesData as Course[]));
};

export const fetchCourseDetails = async (
  courseCode: string
): Promise<Course | null> => {
  const courseData = coursesData as Course[];
  const courseFound =
    courseData.find((course) => course.courseCode === courseCode) || null;
  return new Promise((resolve) => resolve(courseFound));
};

export const fetchRoadmap = async (
  degree: string,
  cohort: string,
  degreeType: string
): Promise<Roadmap> => {
  const getPrerequisites = (courseCode: string): string[] => {
    const course = coursesData.find((c) => c.courseCode === courseCode);
    return course ? course.prerequisites.flat() : [];
  };

  const getCourseInRoadmapType = (courseCode: string): CourseInRoadmapType => {
    if (courseCode.includes("xx")) {
      return CourseInRoadmapType.Elective;
    } else if (courseCode.includes("SC")) {
      return CourseInRoadmapType.CCore;
    } else {
      return CourseInRoadmapType.Core;
    }
  };

  const generateCourseId = (
    year: number,
    semester: number,
    courseCode: string,
    index: number
  ): string => `y${year}s${semester}-${index}-${courseCode}`;
  const getCourseTitle = (courseCode: string): string => {
    const course = coursesData.find((c) => c.courseCode === courseCode);
    return course?.title ?? "";
  };
  const getCourseAu = (courseCode: string): string => {
    const course = coursesData.find((c) => c.courseCode === courseCode);
    return course?.au ? String(course.au) : "";
  };

  return new Promise((resolve, reject) => {
    const roadmap = roadmapData.find(
      (roadmap) =>
        roadmap.degree === degree &&
        roadmap.cohort === cohort &&
        roadmap.type === degreeType
    );

    if (roadmap === undefined) {
      reject(new Error("Roadmap not found"));
      return;
    }

    const transformedRoadmap = {
      ...roadmap,
      coursesByYearSemester: roadmap.coursesByYearSemester.map((val) => {
        return {
          ...val,
          courses: val.courses.map((courseCode, index) => ({
            courseCode,
            prerequisites: getPrerequisites(courseCode),
            title: getCourseTitle(courseCode),
            au: getCourseAu(courseCode),
            id: generateCourseId(val.year, val.semester, courseCode, index),
            type: getCourseInRoadmapType(courseCode),
          })),
        };
      }),
    };
    resolve(transformedRoadmap);
  });
};

export const fetchDegreeProgrammes =
  async (): Promise<GetDegreeProgrammesResp> => {
    return new Promise((resolve) => {
      resolve(degreeProgrammes as GetDegreeProgrammesResp);
    });
  };

export const fetchCareers = async (degree: string): Promise<Career[]> => {
  const careersOfDegree = careers.filter((career) =>
    career.degrees.includes(degree)
  );

  return new Promise((resolve) => {
    resolve(careersOfDegree);
  });
};
