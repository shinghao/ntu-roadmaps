import "./CourseModal.css";
import PrerequisiteGraph from "./PrerequisiteGraph";
import { Button, Drawer, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useFetchCourseDetails from "@hooks/useFetchCourseDetails";

interface Props {
  courseCode: string;
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
}

export default function CourseModal({
  courseCode,
  isModalOpen,
  setIsModalOpen,
}: Props) {
  const { fetchedCourseDetails } = useFetchCourseDetails(courseCode);
  const {
    au = "",
    title = "",
    description = "",
    intendedLearningOutcomes = [],
    semesters = [],
    prerequisites = [[]],
  } = fetchedCourseDetails || {};

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
          {courseCode} - {title || ""}
        </h2>
        <p>{au || "?"} AU</p>
        {semesters.length > 0 && <p>Semesters: {semesters.join(", ")}</p>}
        {description && (
          <>
            <Divider />
            <p>{description}</p>
          </>
        )}
        {intendedLearningOutcomes?.length > 0 && (
          <div>
            <Divider />
            <h3>Intended Learning Outcomes</h3>
            <ol>
              {intendedLearningOutcomes.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
          </div>
        )}
        <Divider />
        <PrerequisiteGraph
          courseId={courseCode}
          prerequisites={prerequisites.map((prereq) => prereq[0]) || []}
        />
      </div>
    </Drawer>
  );
}
