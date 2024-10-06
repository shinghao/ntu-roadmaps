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
    <Paper sx={{ padding: "0.2rem 0.4rem" }}>
      <FormGroup>
        <FormControlLabel
          style={{ marginRight: 0 }}
          control={
            <Switch
              value={isEdgesHidden}
              onChange={toggleShowAllEdges}
              size="small"
              sx={{ marginRight: "2px", marginLeft: "6px" }}
            />
          }
          label={
            <Typography
              style={{
                color: isEdgesHidden ? "grey" : theme.palette.primary.main,
              }}
              fontSize="0.8em"
            >
              All Arrows
            </Typography>
          }
        />
      </FormGroup>
    </Paper>
  );
}
