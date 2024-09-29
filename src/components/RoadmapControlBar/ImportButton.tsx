import { ChangeEvent, memo } from "react";
import { Button } from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import TheTooltip from "@components/Tooltip/Tooltip";
import { ExportData } from "@customTypes/exportData";
import { useCompletedCoursesStore } from "@store/useCompletedCoursesStore";
import useRoadmapSelectsStore from "@store/useRoadmapSelectsStore";

const TOOLTIP_TEXT = "Import JSON";

interface ImportButtonProps {
  onImport: (importedData: ExportData) => void;
}

const ImportButton = memo(({ onImport }: ImportButtonProps) => {
  const { importCompletedCourses } = useCompletedCoursesStore();
  const { setDegree, setCohort, setDegreeType, setCareer } =
    useRoadmapSelectsStore();
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);
        importCompletedCourses(data.completedCourses);
        setDegree(data.degree);
        setCohort(data.cohort);
        setDegreeType(data.degreeType);
        setCareer(data.career);
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
        disableElevation
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
});

export default ImportButton;
