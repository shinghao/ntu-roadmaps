import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Checkbox, IconButton, Typography, Box } from "@mui/material";
import { useCompletedCourses } from "@components/Roadmap/hooks/useCompletedCourses";
import VisibilityIcon from "@mui/icons-material/Visibility";
import React from "react";

interface CurriculumTableProps {
  degree: string;
  career: string;
  cohort: string;
  handleOnOpenCourseModal: (nodeId: string, isElective: boolean) => void;
  updateSelects: (degree: string, career: string, cohort: string) => void;
  fetchedRoadmapData: Models.Roadmap;
}

const backgroundColors = [
  "beige",
  "lightblue",
  "pink",
  "lightsalmon",
  "lightcoral",
];

const CurriculumTable = ({
  career,
  handleOnOpenCourseModal,
  fetchedRoadmapData,
}: CurriculumTableProps) => {
  const { isCourseCompleted, addCompletedCourse, removeCompletedCourse } =
    useCompletedCourses();

  const onCheck = (val: boolean, courseCode: string) => {
    if (val) {
      addCompletedCourse(courseCode);
    } else {
      removeCompletedCourse(courseCode);
    }
  };

  return (
    <>
      <Typography
        variant="h1"
        fontSize={"24px"}
        fontWeight={"bold"}
        align="center"
        marginTop={"32px"}
      >{`${fetchedRoadmapData.cohort} - ${fetchedRoadmapData.degree} - ${career}`}</Typography>
      <TableContainer sx={{ marginTop: "16px", border: "1px solid grey" }}>
        <Table
          size="small"
          sx={{ minWidth: 650 }}
          aria-label="selected curriculum table"
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: "lightgrey" }}>
              <TableCell
                align="center"
                sx={{ borderRight: "1px solid rgba(224, 224, 224)" }}
              >
                Action
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  borderRight: "1px solid rgba(224, 224, 224)",
                  padding: "0",
                }}
              >
                Course Code
              </TableCell>
              <TableCell
                align="center"
                sx={{ borderRight: "1px solid rgba(224, 224, 224)" }}
              >
                Course Title
              </TableCell>
              <TableCell
                align="center"
                sx={{ borderRight: "1px solid rgba(224, 224, 224)" }}
              >
                AU
              </TableCell>
              <TableCell align="center">Prerequisites</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fetchedRoadmapData?.coursesByYearSemester.map(
              ({ courses, year, semester }) => (
                <React.Fragment key={`${year}-${semester}-rows`}>
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{
                        backgroundColor: `${backgroundColors[year]}`,
                        fontWeight: "bold",
                      }}
                    >{`YEAR ${year} SEMESTER ${semester}`}</TableCell>
                  </TableRow>
                  {courses.map((row, index) => (
                    <TableRow
                      hover
                      key={`${year}-${index}-${row.courseCode}`}
                      sx={{
                        "&:last-child td, &:last-child th": { borderBottom: 0 },
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          borderRight: "1px solid rgba(224, 224, 224)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Checkbox
                            checked={isCourseCompleted(row.courseCode)}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => onCheck(event.target.checked, row.courseCode)}
                          />
                          <IconButton
                            aria-label="view course details"
                            size="small"
                            onClick={() =>
                              handleOnOpenCourseModal(
                                row.courseCode,
                                row.courseCode.includes("xxx")
                              )
                            }
                            sx={{
                              paddingX: "0.6rem",
                              borderRadius: "0",
                              "&:hover": { borderBottom: "none" },
                              height: "100%",
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ borderRight: "1px solid rgba(224, 224, 224)" }}
                      >
                        {row.courseCode}
                      </TableCell>
                      <TableCell
                        sx={{ borderRight: "1px solid rgba(224, 224, 224)" }}
                      >
                        {row.title}
                      </TableCell>
                      <TableCell
                        width="5%"
                        align="center"
                        sx={{
                          borderRight: "1px solid rgba(224, 224, 224)",
                        }}
                      >
                        {row?.au || "?"}
                      </TableCell>
                      <TableCell align="center">
                        {row.prerequisites.length > 0
                          ? row.prerequisites.join(", ")
                          : "-"}
                      </TableCell>
                    </TableRow>
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
