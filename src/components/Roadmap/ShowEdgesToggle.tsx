import { FormControlLabel, FormGroup, Switch } from "@mui/material";

interface handleOnShowEdges {
  handleOnShowAllEdges: () => void;
  isEdgesHidden: boolean;
}

export default function ShowEdgesToggle({
  handleOnShowAllEdges,
  isEdgesHidden,
}: handleOnShowEdges) {
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            defaultChecked
            value={isEdgesHidden}
            onChange={handleOnShowAllEdges}
            size="small"
            sx={{ margin: "0px 6px" }}
          />
        }
        label={<span style={{ color: "#1665c0" }}>Show Arrows</span>}
      />
    </FormGroup>
  );
}
