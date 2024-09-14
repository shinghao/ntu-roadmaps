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
        control={
          <Switch
            defaultChecked
            value={isEdgesHidden}
            onChange={onShowAllEdges}
            size="small"
            sx={{ margin: "0px 6px" }}
          />
        }
        label={<span style={{ color: "#1665c0" }}>Show Arrows</span>}
      />
    </FormGroup>
  );
}
