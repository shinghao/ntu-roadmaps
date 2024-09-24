import { ViewFormat } from "@customTypes/index";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";

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
      {Object.values(ViewFormat).map((key) => (
        <ToggleButton value={ViewFormat[key]} key={key} sx={{ width: "6rem" }}>
          {ViewFormat[key]}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default ViewToggle;
