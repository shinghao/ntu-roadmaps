import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import useToggleShowAllEdges from "./hooks/useToggleShowAllEdges";

export default function ShowEdgesToggle() {
  const { isEdgesHidden, toggleShowAllEdges } = useToggleShowAllEdges();

  return (
    <FormGroup>
      <FormControlLabel
        style={{ marginRight: 0 }}
        control={
          <Switch
            defaultChecked
            value={isEdgesHidden}
            onChange={toggleShowAllEdges}
            size="small"
            sx={{ marginRight: "6px" }}
          />
        }
        label={
          <span style={{ color: isEdgesHidden ? "grey" : "black" }}>
            Show Arrows
          </span>
        }
      />
    </FormGroup>
  );
}
