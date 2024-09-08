import { Button } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import TheTooltip from "@components/Tooltip/Tooltip";

const TOOLTIP_TEXT = "Reset all completed courses and selected electives";

interface ResetButtonProps {
  onReset: () => void;
}

export default function ResetButton({ onReset }: ResetButtonProps) {
  return (
    <TheTooltip title={TOOLTIP_TEXT}>
      <Button
        variant="outlined"
        startIcon={<RestartAltIcon />}
        onClick={onReset}
        size="small"
      >
        Reset
      </Button>
    </TheTooltip>
  );
}
