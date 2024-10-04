import { ViewFormat } from "@customTypes/index";
import { ToggleButtonGroup, ToggleButton, Stack } from "@mui/material";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import TableRowsOutlinedIcon from "@mui/icons-material/TableRowsOutlined";

const ViewToggle = ({
  viewFormat,
  setViewFormat,
}: {
  viewFormat: ViewFormat;
  setViewFormat: (viewFormat: ViewFormat) => void;
}) => {
  return (
    <ToggleButtonGroup
      value={viewFormat}
      exclusive
      onChange={(_, newAlignment: ViewFormat) => {
        setViewFormat(newAlignment);
      }}
      aria-label="view format"
      size="small"
      color="primary"
    >
      <ToggleButton
        value={ViewFormat.Roadmap}
        key={ViewFormat.Roadmap}
        sx={{ width: "6.5rem", textTransform: "none" }}
      >
        <Stack
          flexDirection="row"
          gap="0.3rem"
          justifyContent="center"
          alignItems="center"
        >
          <MapOutlinedIcon
            fontSize="small"
            sx={{ width: "1rem", height: "1rem" }}
          />
          {ViewFormat.Roadmap}
        </Stack>
      </ToggleButton>
      <ToggleButton
        value={ViewFormat.Table}
        key={ViewFormat.Table}
        sx={{ width: "6.5rem", textTransform: "none" }}
      >
        <Stack
          flexDirection="row"
          gap="0.3rem"
          justifyContent="center"
          alignItems="center"
        >
          <TableRowsOutlinedIcon
            fontSize="small"
            sx={{ width: "1rem", height: "1rem" }}
          />
          {ViewFormat.Table}
        </Stack>
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ViewToggle;
