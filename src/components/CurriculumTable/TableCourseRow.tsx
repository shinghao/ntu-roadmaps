import isPrerequisitesCompleted from "@utils/isPrerequisitesCompleted";
import {
  TableRow,
  TableCell,
  Box,
  Checkbox,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import OpenCourseModalBtn from "./OpenCourseModalBtn";
import { CourseInRoadmap, CourseInRoadmapType } from "@customTypes/roadmap";
import { Check, CheckBoxOutlineBlankRounded, Lock } from "@mui/icons-material";
import { useCompletedCoursesStore } from "@store/useCompletedCoursesStore";
import ElectiveBtn from "./ElectiveBtn";
import { checkedCourseBg, completedCourseBg } from "../../theme";

interface Props {
  year: number;
  semester: number;
  index: number;
  row: CourseInRoadmap;
  sx: SxProps;
}

const TableCourseRow = ({ year, semester, index, row, sx }: Props) => {
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
  const isElective = row.type === CourseInRoadmapType.Elective;
  const isUnselectedElective = isElective && !row.title;

  return (
    <TableRow
      key={`${year}-${semester}-${row.courseCode}-${index}`}
      sx={{
        "&:last-child td, &:last-child th": { borderBottom: 0 },
        ...sx,
        backgroundColor: isCompleted ? completedCourseBg : "inherit",
        height: "50px",
      }}
    >
      <TableCell
        sx={{
          borderRight: "1px solid rgba(224, 224, 224)",
          maxWidth: "100px",
          paddingX: "1rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {isAvailable && !isUnselectedElective ? (
            <Checkbox
              checked={isCompleted}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                onCheck(event.target.checked, row.courseCode)
              }
              sx={{
                padding: 0,
                "&.Mui-checked": { background: checkedCourseBg },
              }}
              checkedIcon={<Check sx={{ color: "white" }} />}
              icon={<CheckBoxOutlineBlankRounded />}
              size="small"
            />
          ) : (
            <Stack alignItems="center" justifyContent="center">
              <Lock color="disabled" fontSize="small" />
            </Stack>
          )}
        </Box>
      </TableCell>

      <TableCell
        align="center"
        sx={{ borderRight: "1px solid rgba(224, 224, 224)", maxWidth: "160px" }}
      >
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          gap="8px"
        >
          <Typography variant="body2" width="70px">
            {row.courseCode}
          </Typography>
          <OpenCourseModalBtn nodeId={row.id} courseType={row.type} />
        </Stack>
      </TableCell>

      <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224)" }}>
        {isElective ? (
          <ElectiveBtn nodeId={row.id} electiveTitle={row.title} />
        ) : (
          <Typography variant="body2" paddingLeft="8px">
            {row.title}
          </Typography>
        )}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          borderRight: "1px solid rgba(224, 224, 224)",
        }}
      >
        <Typography variant="body2">{row?.au || "?"}</Typography>
      </TableCell>

      <TableCell align="center">
        <Typography variant="body2">
          {row.prerequisites.length > 0 ? row.prerequisites.join(", ") : "-"}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default TableCourseRow;
