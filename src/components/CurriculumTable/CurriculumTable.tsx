import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import { Typography } from "@mui/material";
import { type Roadmap } from "@customTypes/index";
import TableHeader from "./TableHeader";
import SemesterCourseRows from "./SemesterCourseRows";
import useRoadmapSelectsStore from "@store/useRoadmapSelectsStore";

interface CurriculumTableProps {
  roadmapData: Roadmap;
}

const CurriculumTable = ({ roadmapData }: CurriculumTableProps) => {
  const { degree, career, cohort } = useRoadmapSelectsStore();

  return (
    <>
      <Typography
        variant="h1"
        fontSize={"24px"}
        fontWeight={"bold"}
        align="center"
        marginTop={"32px"}
      >{`AY${cohort} - ${degree} (${career})`}</Typography>
      <TableContainer sx={{ marginTop: "16px", border: `1px solid grey` }}>
        <Table
          size="small"
          sx={{ minWidth: 650, width: "100%" }}
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
