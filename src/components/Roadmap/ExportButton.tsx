import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import TheTooltip from "@components/Tooltip/Tooltip";

const TOOLTIP_TEXT = "Save config and completed courses as JSON";

interface ExportButtonProps {
  degree: string;
  career: string;
  cohort: string;
  completedCourses: string[];
}

export default function ExportButton(data: ExportButtonProps) {
  const onExport = () => {
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.download = "data.json";
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <TheTooltip title={TOOLTIP_TEXT}>
      <Button
        variant="contained"
        startIcon={<DownloadIcon />}
        onClick={onExport}
        size="small"
        sx={{
          "&:hover": {
            borderBottom: "none",
          },
        }}
      >
        Export
      </Button>
    </TheTooltip>
  );
}
