import { Button, Tooltip } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

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
    <Tooltip title={TOOLTIP_TEXT} arrow placement="top">
      <Button
        variant="contained"
        startIcon={<DownloadIcon />}
        onClick={onExport}
        sx={{
          "&:hover": {
            borderBottom: "none",
          },
        }}
      >
        Export
      </Button>
    </Tooltip>
  );
}
