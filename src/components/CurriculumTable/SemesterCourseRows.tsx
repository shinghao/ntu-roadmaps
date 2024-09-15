import { CourseInRoadmap } from "@customTypes/roadmap";
import SemesterRow from "./SemesterRow";
import TableCourseRow from "./TableCourseRow";
import { useState } from "react";

interface Props {
  year: number;
  semester: number;
  courses: CourseInRoadmap[];
  handleOnOpenCourseModal: (nodeId: string, isElective: boolean) => void;
}

const COLLAPSE_DELAY = 0.01;

const SemesterCourseRows = ({
  year,
  semester,
  courses,
  handleOnOpenCourseModal,
}: Props) => {
  const [isCourseRowsHidden, setIsCourseRowsHidden] = useState(false);

  return (
    <>
      <SemesterRow
        year={year}
        semester={semester}
        isCourseRowsHidden={isCourseRowsHidden}
        setIsCourseRowsHidden={setIsCourseRowsHidden}
      />

      {courses.map((row, index) => (
        <TableCourseRow
          key={`${year}-${semester}-${row.courseCode}-${index}-parent`}
          year={year}
          semester={semester}
          index={index}
          row={row}
          handleOnOpenCourseModal={handleOnOpenCourseModal}
          sx={{
            transition: "all 0.3s ease",
            visibility: isCourseRowsHidden ? "collapse" : "visible",
            transitionDelay: `${
              isCourseRowsHidden
                ? (courses.length - index) * COLLAPSE_DELAY
                : index * COLLAPSE_DELAY
            }s`,
          }}
        />
      ))}
    </>
  );
};

export default SemesterCourseRows;
