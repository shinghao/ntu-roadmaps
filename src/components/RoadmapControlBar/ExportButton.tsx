import SaveIcon from "@mui/icons-material/Save";
import TheTooltip from "@components/Tooltip/Tooltip";
import { Elective } from "@customTypes/course";
import { useCompletedCoursesStore } from "@store/useCompletedCoursesStore";
import useRoadmapSelectsStore from "@store/useRoadmapSelectsStore";
import { Button, IconButton, useMediaQuery } from "@mui/material";

const TOOLTIP_TEXT = "Save current data as JSON";

interface ExportButtonProps {
  selectedElectives: Elective[];
}

export default function ExportButton({ selectedElectives }: ExportButtonProps) {
  const { completedCourses } = useCompletedCoursesStore();
  const { degree, career, degreeType, cohort } = useRoadmapSelectsStore();
  const isSmallScreen = useMediaQuery("(max-width: 640px)");

  const onExport = () => {
    const dataToExport = {
      degree,
      career,
      degreeType,
      cohort,
      selectedElectives,
      completedCourses,
    };
    const json = JSON.stringify(dataToExport);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.download = "saved_roadmap.json";
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <TheTooltip title={TOOLTIP_TEXT}>
      {isSmallScreen ? (
        <IconButton
          sx={{ border: "1px solid lightgrey", padding: "0.5rem" }}
          size="small"
          onClick={onExport}
        >
          <SaveIcon fontSize="small" />
        </IconButton>
      ) : (
        <Button
          variant="outlined"
          disableElevation
          sx={{
            textTransform: "none",
            borderRadius: "0.9rem",
            padding: "0.4rem 1rem",
          }}
          size="small"
          startIcon={<SaveIcon sx={{ width: "0.9em" }} />}
          onClick={onExport}
        >
          Save
        </Button>
      )}
    </TheTooltip>
  );
}
