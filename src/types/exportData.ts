import { Elective } from "./course";

export interface ExportData {
  degree: string;
  career: string;
  cohort: string;
  degreeType: string;
  completedCourses: string[];
  selectedElectives: Elective[];
}
