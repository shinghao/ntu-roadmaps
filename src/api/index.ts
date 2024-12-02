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
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
// This flag is to toggle between using the backend data or the json files in frontend
const IS_USE_BACKEND_DATA = import.meta.env.VITE_IS_USE_BACKEND_DATA;

export const fetchCourseDetails = async (
  courseCode: string
): Promise<Course | null> => {
  if (IS_USE_BACKEND_DATA) {
    const { data } = await axios.get(`${BACKEND_URL}/course/${courseCode}`);
    return data;
  }

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

    // TODO: Temporary added hard coded implementation for MH1810, as it is not longer a prerequisite in AY2024
    if (
      course &&
      cohort === "2024" &&
      course?.prerequisites?.flat()?.includes("MH1810")
    ) {
      return course.prerequisites
        .flat()
        .filter((prereq) => prereq !== "MH1810");
    }

    return course ? course.prerequisites.flat() : [];
  };

  const getCourseInRoadmapType = (courseCode: string): CourseInRoadmapType => {
    if (courseCode.includes("xx")) {
      return CourseInRoadmapType.Elective;
    } else if (courseCode === "BDE") {
      return CourseInRoadmapType.Bde;
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
  const getCourseAu = (courseCode: string) => {
    const course = coursesData.find((c) => c.courseCode === courseCode);
    return course?.au;
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
    if (IS_USE_BACKEND_DATA) {
      const { data } = await axios.get(`${BACKEND_URL}/degrees`);
      return data;
    }
    return new Promise((resolve) => {
      resolve(degreeProgrammes as GetDegreeProgrammesResp);
    });
  };

export const fetchCareers = async (degree: string): Promise<Career[]> => {
  if (IS_USE_BACKEND_DATA) {
    const { data } = await axios.get(`${BACKEND_URL}/careers/${degree}`);
    return data;
  }

  const careersOfDegree = careers.filter((career) =>
    career.degrees.includes(degree)
  );

  return new Promise((resolve) => {
    resolve(careersOfDegree);
  });
};
