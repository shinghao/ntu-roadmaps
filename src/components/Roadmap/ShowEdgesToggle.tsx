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
          />
        }
        label="Show Arrows"
      />
    </FormGroup>
  );
}
