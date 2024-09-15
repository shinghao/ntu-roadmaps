import {
  TableRow,
  TableCell,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const SemesterRow = ({
  year,
  semester,
  isCourseRowsHidden,
  setIsCourseRowsHidden,
}: {
  year: number;
  semester: number;
  isCourseRowsHidden: boolean;
  setIsCourseRowsHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const backgroundColors = [
    "beige",
    "lightblue",
    "pink",
    "lightsalmon",
    "lightcoral",
  ];

  return (
    <TableRow>
      <TableCell
        colSpan={5}
        align="center"
        sx={{
          backgroundColor: `${backgroundColors[year]}`,
          fontWeight: "bold",
        }}
      >
        <Stack
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          gap="4px"
        >
          <Typography
            fontSize="inherit"
            fontWeight="bold"
          >{`YEAR ${year} SEMESTER ${semester}`}</Typography>
          <IconButton
            disableRipple
            aria-label={`hide ${year} SEMESTER ${semester} courses`}
            size="small"
            onClick={() => setIsCourseRowsHidden(!isCourseRowsHidden)}
          >
            {isCourseRowsHidden ? (
              <KeyboardArrowDownIcon />
            ) : (
              <KeyboardArrowUpIcon />
            )}
          </IconButton>
        </Stack>
      </TableCell>
    </TableRow>
  );
};

export default SemesterRow;
