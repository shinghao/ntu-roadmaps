import { TableHead, TableRow, TableCell } from "@mui/material";

const TableHeader = () => {
  const columnBorderColor = "rgba(224, 224, 224)";
  const headerBackgroundColor = "lightgrey";

  const HeaderData = [
    { headerName: "Active" },
    { headerName: "Course Code" },
    { headerName: "Course Title" },
    { headerName: "AU" },
    { headerName: "Prerequisites" },
  ];

  return (
    <TableHead>
      <TableRow sx={{ backgroundColor: headerBackgroundColor }}>
        {HeaderData.map((header) => (
          <TableCell
            key={header.headerName}
            align="center"
            sx={{ borderRight: `1px solid ${columnBorderColor}` }}
          >
            {header.headerName}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;
