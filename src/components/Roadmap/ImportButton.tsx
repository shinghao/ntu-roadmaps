import { ChangeEvent } from "react";
import { Button } from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import TheTooltip from "@components/Tooltip/Tooltip";

const TOOLTIP_TEXT = "Import JSON";

interface ImportButtonProps {
  onImport: (data: {
    degree: string;
    career: string;
    cohort: string;
    completedCourses: string[];
  }) => void;
}

export default function ImportButton({ onImport }: ImportButtonProps) {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);
        onImport(data);
      } catch (error) {
        console.error("Import Error", error);
      }
    };

    reader.readAsText(file);
  };

  return (
    <TheTooltip title={TOOLTIP_TEXT}>
      <Button
        variant="contained"
        component="label"
        startIcon={<FileUploadOutlinedIcon />}
        size="small"
      >
        Import
        <input
          type="file"
          accept="application/json"
          hidden
          onChange={handleFileChange}
        />
      </Button>
    </TheTooltip>
  );
}
