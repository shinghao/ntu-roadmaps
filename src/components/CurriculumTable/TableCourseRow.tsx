import { isPrerequisitesCompleted } from "@components/Roadmap/util/buildRoadmap.util";
import {
  TableRow,
  TableCell,
  Box,
  Checkbox,
  Stack,
  SxProps,
} from "@mui/material";
import OpenCourseModalBtn from "./OpenCourseModalBtn";
import { CourseInRoadmap, CourseInRoadmapType } from "@customTypes/roadmap";
import { CheckBox, Lock } from "@mui/icons-material";
import { useCompletedCoursesStore } from "../../store/useCompletedCoursesStore";

interface Props {
  year: number;
  semester: number;
  index: number;
  row: CourseInRoadmap;
  handleOnOpenCourseModal: (nodeId: string, isElective: boolean) => void;
  sx: SxProps;
}

const TableCourseRow = ({
  year,
  semester,
  index,
  row,
  handleOnOpenCourseModal,
  sx,
}: Props) => {
  const { isCourseCompleted, addCompletedCourse, removeCompletedCourse } =
    useCompletedCoursesStore();

  const onCheck = (val: boolean, courseCode: string) => {
    if (val) {
      addCompletedCourse(courseCode);
    } else {
      removeCompletedCourse(courseCode);
    }
  };
  const isAvailable = isPrerequisitesCompleted(row.courseCode);
  const isCompleted = isCourseCompleted(row.courseCode);

  return (
    <TableRow
      hover
      key={`${year}-${semester}-${row.courseCode}-${index}`}
      sx={{
        "&:last-child td, &:last-child th": { borderBottom: 0 },
        textDecoration: isCourseCompleted(row.courseCode)
          ? "line-through"
          : "none",
        ...sx,
      }}
    >
      <TableCell
        width="12%"
        sx={{
          borderRight: "1px solid rgba(224, 224, 224)",
          maxWidth: "100px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isAvailable ? (
            <Checkbox
              checked={isCompleted}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                onCheck(event.target.checked, row.courseCode)
              }
              checkedIcon={<CheckBox sx={{ color: "lightgrey" }} />}
            />
          ) : (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ width: "42px" }}
            >
              <Lock color="disabled" fontSize="small" />
            </Stack>
          )}
          <OpenCourseModalBtn
            courseCode={row.courseCode}
            handleOnOpenCourseModal={() =>
              handleOnOpenCourseModal(
                row.id,
                row.type === CourseInRoadmapType.Elective
              )
            }
          />
        </Box>
      </TableCell>
      <TableCell
        width="10%"
        align="center"
        sx={{ borderRight: "1px solid rgba(224, 224, 224)" }}
      >
        {row.courseCode}
      </TableCell>
      <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224)" }}>
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
        {row.prerequisites.length > 0 ? row.prerequisites.join(", ") : "-"}
      </TableCell>
    </TableRow>
  );
};

export default TableCourseRow;
