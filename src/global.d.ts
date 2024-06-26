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
    id: string;
    school: string;
    degreeName: string;
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

  interface RecommendedElectives {
    career: string;
    electives: string[];
  }

  interface Roadmap {
    id: string;
    degreeCohort: string;
    degree: string;
    cohort: string;
    coursesByYearSemester: YearSemester[];
    recommendedElectivesByCareer: RecommendedElectives[];
  }
}
