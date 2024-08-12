import roadmapData from "../data/roadmapdata.json";
import coursesData from "../data/courses.json";
import degreeProgrammes from "../data/degreeProgrammes.json";
import careers from "../data/careers.json";

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
  cohort: string,
  degreeType: string
): Promise<Models.Roadmap> => {
  const getPrerequisites = (courseCode: string): string[] => {
    const course = coursesData.find((c) => c.courseCode === courseCode);
    return course ? course.prerequisites.flat() : [];
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
          courses: val.courses.map((courseCode) => ({
            courseCode,
            prerequisites: getPrerequisites(courseCode),
          })),
        };
      }),
    };
    resolve(transformedRoadmap);
  });
};

export const fetchDegreeProgrammes =
  async (): Promise<Models.GetDegreeProgrammesResp> => {
    return new Promise((resolve) => {
      resolve(degreeProgrammes as Models.GetDegreeProgrammesResp);
    });
  };

export const fetchCareers = async (
  degree: string
): Promise<Models.Career[]> => {
  const careersOfDegree = careers.filter((career) =>
    career.degrees.includes(degree)
  );

  return new Promise((resolve) => {
    resolve(careersOfDegree);
  });
};
