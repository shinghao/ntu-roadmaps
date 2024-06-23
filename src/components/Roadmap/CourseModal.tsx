import "./CourseModal.css";
import courses from "../../data/courses.json";
import PrerequisiteGraph from "./PrerequisiteGraph";
import { Button, Drawer, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface CourseData {
  title: string;
  AU: string | number;
  "Course Aims"?: string;
  "Intended Learning Outcomes"?: string[];
  prerequisites?: string[];
}

interface Props {
  courseId: string;
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
}

export default function CourseModal({
  courseId,
  isModalOpen,
  setIsModalOpen,
}: Props) {
  const typedCourses: Record<string, CourseData> = courses;
  const courseData: CourseData = typedCourses[courseId];

  return (
    <Drawer
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      anchor="right"
    >
      <div className="modal-container">
        <Button
          variant="outlined"
          color="error"
          startIcon={<ArrowBackIcon />}
          onClick={() => setIsModalOpen(false)}
        >
          ESC
        </Button>
        <h2>
          {courseId} - {courseData?.title || ""}
        </h2>
        <p>{courseData?.AU || "?"} AU</p>
        {courseData?.["Course Aims"] && (
          <>
            <Divider />
            <p>{courseData["Course Aims"]}</p>
          </>
        )}
        {courseData?.["Intended Learning Outcomes"] && (
          <div>
            <Divider />
            <h3>Intended Learning Outcomes</h3>
            <ol>
              {courseData["Intended Learning Outcomes"].map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
          </div>
        )}
        <Divider />
        <PrerequisiteGraph
          courseId={courseId}
          prerequisites={courseData?.prerequisites || []}
        />
      </div>
    </Drawer>
  );
}
