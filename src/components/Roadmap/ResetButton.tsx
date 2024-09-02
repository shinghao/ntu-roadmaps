import { Button, Tooltip } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const TOOLTIP_TEXT = "Reset all completed courses";

interface ResetButtonProps {
  onReset: () => void;
}

export default function ResetButton({ onReset }: ResetButtonProps) {
  return (
    <Tooltip title={TOOLTIP_TEXT} arrow placement="top">
      <Button
        variant="outlined"
        startIcon={<RestartAltIcon />}
        onClick={onReset}
        size="small"
      >
        Reset
      </Button>
    </Tooltip>
  );
}
