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

  enum DegreeType {
    Normal = "normal",
    NormalPA = "normal_pa",
    NormalPI = "normal_pi",
    Polytechnic = "polytechnic",
    PolytechnicPA = "polytechnic_pa",
    PolytechnicPI = "polytechnic_pi",
    AcceleratedBachelor = "acceleratedBachelor",
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
