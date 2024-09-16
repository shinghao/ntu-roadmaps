import { Button } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import TheTooltip from "@components/Tooltip/Tooltip";
import { useState } from "react";
import ConfirmationDialog from "@components/ConfirmationDialog";

const TOOLTIP_TEXT = "Reset all completed courses and selected electives";

interface ResetButtonProps {
  onReset: () => void;
  isSmallScreen: boolean;
}

export default function ResetButton({
  onReset,
  isSmallScreen,
}: ResetButtonProps) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const onConfirmReset = () => {
    onReset();
    setIsConfirmDialogOpen(false);
  };

  const onCancelReset = () => {
    setIsConfirmDialogOpen(false);
  };

  return (
    <>
      <TheTooltip title={TOOLTIP_TEXT}>
        {isSmallScreen ? (
          <Button
            variant="outlined"
            onClick={() => setIsConfirmDialogOpen(true)}
            size="small"
          >
            <RestartAltIcon />
          </Button>
        ) : (
          <Button
            variant="outlined"
            startIcon={<RestartAltIcon />}
            onClick={() => setIsConfirmDialogOpen(true)}
            size="small"
          >
            Reset
          </Button>
        )}
      </TheTooltip>
      <ConfirmationDialog
        open={isConfirmDialogOpen}
        onClose={onCancelReset}
        onConfirm={onConfirmReset}
        title="Are you sure you want to reset?"
        description="All completed courses and selected electives data will be lost."
        confirmText="Reset"
        cancelText="Cancel"
        icon={<RestartAltIcon color="warning" />}
      />
    </>
  );
}
