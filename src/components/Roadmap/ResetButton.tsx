import { Button, Tooltip } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const TOOLTIP_TEXT = "Reset all completed courses";

interface ResetButtonProps {
  setCompletedCourses: (val: Set<string>) => void;
}

export default function ResetButton({ setCompletedCourses }: ResetButtonProps) {
  const onReset = () => {
    localStorage.setItem("completedCourses", JSON.stringify([]));
    setCompletedCourses(new Set([]));
  };

  return (
    <Tooltip title={TOOLTIP_TEXT} arrow placement="top">
      <Button
        variant="outlined"
        startIcon={<RestartAltIcon />}
        onClick={onReset}
      >
        Reset
      </Button>
    </Tooltip>
  );
}
