import { Button } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import TheTooltip from "@components/Tooltip/Tooltip";
import { useState } from "react";
import ConfirmationDialog from "@components/ConfirmationDialog";
import { Elective } from "@customTypes/index";
import { useCompletedCoursesStore } from "@store/useCompletedCoursesStore";

const TOOLTIP_TEXT = "Reset all completed courses and selected electives";

interface ResetButtonProps {
  setSelectedElectives: (electives: Elective[]) => void;
}

export default function ResetButton({
  setSelectedElectives,
}: ResetButtonProps) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const { resetCompletedCourse } = useCompletedCoursesStore();
  const onReset = () => {
    resetCompletedCourse();
    setSelectedElectives([]);
  };

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
        <Button
          variant="outlined"
          disableElevation
          startIcon={<RestartAltIcon />}
          onClick={() => setIsConfirmDialogOpen(true)}
          size="small"
        >
          Reset
        </Button>
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
