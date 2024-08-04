declare namespace Models {
  interface Course {
    id: string;
    courseCode: string;
    au: number;
    title: string;
    description: string;
    intendedLearningOutcomes: string[];
    semesters: number[];
    prerequisites: string[][];
    otherPrerequisites?: string;
    school: string;
    yearStanding: number;
  }

  interface Degree {
    school: string;
    degree: string;
  }

  /* ROADMAP */
  interface CourseInRoadmap {
    courseCode: string;
    prerequisites: string[];
  }

  interface YearSemester {
    year: number;
    semester: number;
    courses: CourseInRoadmap[];
  }

  interface Roadmap {
    degree: string;
    cohort: string;
    coursesByYearSemester: YearSemester[];
  }

  /* Career */
  interface Career {
    career: string;
    degrees: string[];
    electives: string[];
  }
}
