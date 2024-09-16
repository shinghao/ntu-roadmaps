import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import TheTooltip from "@components/Tooltip/Tooltip";
import { ExportData } from "@customTypes/exportData";

const TOOLTIP_TEXT = "Save config and completed courses as JSON";

interface ExportButtonProps {
  dataToExport: ExportData;
}

export default function ExportButton({ dataToExport }: ExportButtonProps) {
  const onExport = () => {
    const json = JSON.stringify(dataToExport);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.download = "exported_roadmap.json";
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <TheTooltip title={TOOLTIP_TEXT}>
      <Button
        variant="contained"
        disableElevation
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
