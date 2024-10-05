import RestartAltIcon from "@mui/icons-material/RestartAlt";
import TheTooltip from "@components/Tooltip/Tooltip";
import { useState } from "react";
import ConfirmationDialog from "@components/ConfirmationDialog";
import { Elective } from "@customTypes/index";
import { useCompletedCoursesStore } from "@store/useCompletedCoursesStore";
import { IconButton } from "@mui/material";

const TOOLTIP_TEXT = "Reset all completed courses and electives";

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
        <IconButton onClick={() => setIsConfirmDialogOpen(true)}>
          <RestartAltIcon sx={{ width: "1.2rem", height: "1.2rem" }} />
        </IconButton>
      </TheTooltip>
      <ConfirmationDialog
        open={isConfirmDialogOpen}
        onClose={onCancelReset}
        onConfirm={onConfirmReset}
        title="🚨 Are you sure you want to reset? 🚨"
        description="All completed courses and selected electives data will be lost."
        confirmText="Reset"
        cancelText="Cancel"
      />
    </>
  );
}
