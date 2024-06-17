import React from "react";
import "./CourseModal.css";
import courses from "../../data/courses.json";
import PrerequisiteGraph from "./PrerequisiteGraph";

interface CourseData {
  title: string;
  au: string | number;
  semesters?: number[];
  "Course Aims"?: string;
  "Intended Learning Outcomes"?: string[];
  prerequisites?: string[];
}

interface Props {
  courseId: string;
  dialogRef: React.RefObject<HTMLDialogElement>;
}

const CourseModal: React.FC<Props> = ({ courseId, dialogRef }) => {
  const typedCourses: Record<string, CourseData> = courses;
  const courseData: CourseData = typedCourses[courseId];

  return (
    <dialog ref={dialogRef}>
      <h2>
        {courseId} - {courseData?.title || ""}
      </h2>
      <hr className="my-4" />
      <p>{courseData?.au || "?"} AU</p>
      {<p>Semesters: {courseData?.semesters || ""}</p>}
      {courseData?.["Course Aims"] && <p>{courseData["Course Aims"]}</p>}
      <hr className="my-4" />
      {courseData?.["Intended Learning Outcomes"] && (
        <div>
          <span className="bold">Intended Learning Outcomes:</span>
          <ol>
            {courseData["Intended Learning Outcomes"].map((item, index) => (
              <li key={index} className="mb-2">
                {item}
              </li>
            ))}
          </ol>
        </div>
      )}
      <hr className="my-4" />
      <PrerequisiteGraph
        courseId={courseId}
        prerequisites={courseData?.prerequisites || []}
      />
    </dialog>
  );
};

export default CourseModal;
