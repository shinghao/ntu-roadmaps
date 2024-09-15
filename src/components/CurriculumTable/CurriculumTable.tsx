import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import { Typography } from "@mui/material";
import { Elective, type Roadmap } from "@customTypes/index";
import TableHeader from "./TableHeader";
import SemesterCourseRows from "./SemesterCourseRows";

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
          sx={{ minWidth: 650, tableLayout: "fixed", width: "100%" }}
          aria-label="selected curriculum table"
        >
          <TableHeader />
          <TableBody>
            {roadmapData?.coursesByYearSemester.map(
              ({ courses, year, semester }) => (
                <SemesterCourseRows
                  key={`${year}-${semester}-rows`}
                  year={year}
                  semester={semester}
                  courses={courses}
                  handleOnOpenCourseModal={handleOnOpenCourseModal}
                />
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CurriculumTable;
