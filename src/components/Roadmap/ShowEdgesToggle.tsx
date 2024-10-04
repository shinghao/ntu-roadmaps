import {
  FormControlLabel,
  FormGroup,
  Paper,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";
import useToggleShowAllEdges from "./hooks/useToggleShowAllEdges";

export default function ShowEdgesToggle() {
  const { isEdgesHidden, toggleShowAllEdges } = useToggleShowAllEdges();
  const theme = useTheme();

  return (
    <Paper sx={{ padding: "0.4rem 0.6rem" }}>
      <FormGroup>
        <FormControlLabel
          style={{ marginRight: 0 }}
          control={
            <Switch
              defaultChecked
              value={isEdgesHidden}
              onChange={toggleShowAllEdges}
              size="small"
              sx={{ marginRight: "6px", marginLeft: "3px" }}
            />
          }
          label={
            <Typography
              style={{
                color: isEdgesHidden ? "grey" : theme.palette.primary.main,
              }}
              fontSize="0.8em"
            >
              Show Arrows
            </Typography>
          }
        />
      </FormGroup>
    </Paper>
  );
}
