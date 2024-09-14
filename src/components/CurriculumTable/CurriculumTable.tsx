import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import { Typography } from "@mui/material";
import React from "react";
import { Elective, type Roadmap } from "@customTypes/index";
import SemesterRow from "./SemesterRow";
import TableHeader from "./TableHeader";
import TableCourseRow from "./TableCourseRow";

interface CurriculumTableProps {
  career: string;
  handleOnOpenCourseModal: (nodeId: string, isElective: boolean) => void;
  selectedElectives: Elective[];
  roadmapData: Roadmap;
}

const CurriculumTable = ({
  career,
  handleOnOpenCourseModal,
  roadmapData,
}: CurriculumTableProps) => {
  const { cohort, degree } = roadmapData;

  return (
    <>
      <Typography
        variant="h1"
        fontSize={"24px"}
        fontWeight={"bold"}
        align="center"
        marginTop={"32px"}
      >{`${cohort} - ${degree} - ${career}`}</Typography>
      <TableContainer sx={{ marginTop: "16px", border: `1px solid grey` }}>
        <Table
          size="small"
          sx={{ minWidth: 650 }}
          aria-label="selected curriculum table"
        >
          <TableHeader />
          <TableBody>
            {roadmapData?.coursesByYearSemester.map(
              ({ courses, year, semester }) => (
                <React.Fragment key={`${year}-${semester}-rows`}>
                  <SemesterRow year={year} semester={semester} />
                  {courses.map((row, index) => (
                    <TableCourseRow
                      key={`${year}-${semester}-${row.courseCode}-${index}-parent`}
                      year={year}
                      semester={semester}
                      index={index}
                      row={row}
                      handleOnOpenCourseModal={handleOnOpenCourseModal}
                    />
                  ))}
                </React.Fragment>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CurriculumTable;
