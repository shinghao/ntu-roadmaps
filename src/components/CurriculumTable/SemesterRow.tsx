import { TableRow, TableCell } from "@mui/material";

const SemesterRow = ({
  year,
  semester,
}: {
  year: number;
  semester: number;
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
      >{`YEAR ${year} SEMESTER ${semester}`}</TableCell>
    </TableRow>
  );
};

export default SemesterRow;
