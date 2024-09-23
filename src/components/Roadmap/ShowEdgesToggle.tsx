import { FormControlLabel, FormGroup, Switch } from "@mui/material";

interface handleOnShowEdges {
  onShowAllEdges: () => void;
  isEdgesHidden: boolean;
}

export default function ShowEdgesToggle({
  onShowAllEdges,
  isEdgesHidden,
}: handleOnShowEdges) {
  return (
    <FormGroup>
      <FormControlLabel
        style={{ marginRight: 0 }}
        control={
          <Switch
            defaultChecked
            value={isEdgesHidden}
            onChange={onShowAllEdges}
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
