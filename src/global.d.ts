declare namespace Models {
  interface Course {
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

  /* Degree Programmes */

  interface CohortsByYear {
    [year: string]: string[];
  }

  interface DegreeProgram {
    school: string;
    degree: string;
    cohorts: CohortsByYear;
  }

  type GetDegreeProgrammesResp = DegreeProgram[];

  /* ROADMAP */
  interface CourseInRoadmap {
    courseCode: string;
    prerequisites: string[];
    title: string;
    au: string;
  }

  interface YearSemester {
    year: number;
    semester: number;
    courses: CourseInRoadmap[];
  }

  interface Roadmap {
    degree: string;
    cohort: string;
    type?: string;
    coursesByYearSemester: YearSemester[];
  }

  /* Career */
  interface Career {
    career: string;
    degrees: string[];
    electives: string[];
  }
}
