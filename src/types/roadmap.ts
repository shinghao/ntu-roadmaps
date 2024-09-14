export enum CourseInRoadmapType {
  Elective = "elective",
  Bde = "bde",
  Core = "core",
  CCore = "c-core",
  FCore = "f-core",
}

export interface CourseInRoadmap {
  courseCode: string;
  prerequisites: string[];
  id: string;
  type: CourseInRoadmapType;
}

export interface YearSemester {
  year: number;
  semester: number;
  courses: CourseInRoadmap[];
}

export interface Roadmap {
  degree: string;
  cohort: string;
  type?: string;
  coursesByYearSemester: YearSemester[];
}
