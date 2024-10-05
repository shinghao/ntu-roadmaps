import { TableHead, TableRow, TableCell } from "@mui/material";

const TableHeader = () => {
  const columnBorderColor = "rgba(224, 224, 224)";
  const headerBackgroundColor = "lightgrey";

  const HeaderData = [
    { headerName: "Status" },
    { headerName: "Code" },
    { headerName: "Title" },
    { headerName: "AU" },
    { headerName: "Prerequisites" },
  ];

  return (
    <TableHead>
      <TableRow sx={{ backgroundColor: headerBackgroundColor }}>
        {HeaderData.map((header, index) => (
          <TableCell
            key={header.headerName}
            align="center"
            sx={{
              borderRight:
                index !== HeaderData.length - 1
                  ? `1px solid ${columnBorderColor}`
                  : "none",
            }}
          >
            {header.headerName}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;
