import roadmapData from "../data/roadmapdata.json";
import coursesData from "../data/courses.json";

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
  cohort: string
): Promise<Models.Roadmap> => {
  const getPrerequisites = (courseCode: string): string[] => {
    const course = coursesData.find((c) => c.courseCode === courseCode);
    return course ? course.prerequisites.flat() : [];
  };

  return new Promise((resolve, reject) => {
    const roadmap = roadmapData.find(
      (roadmap) => roadmap.degree === degree && roadmap.cohort === cohort
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
