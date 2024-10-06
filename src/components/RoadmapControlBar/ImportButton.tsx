import { ChangeEvent, memo } from "react";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import TheTooltip from "@components/Tooltip/Tooltip";
import { ExportData } from "@customTypes/exportData";
import { useCompletedCoursesStore } from "@store/useCompletedCoursesStore";
import useRoadmapSelectsStore from "@store/useRoadmapSelectsStore";
import { Button, IconButton, useMediaQuery } from "@mui/material";

const TOOLTIP_TEXT = "Import JSON";

interface ImportButtonProps {
  onImport: (importedData: ExportData) => void;
}

const ImportButton = memo(({ onImport }: ImportButtonProps) => {
  const { importCompletedCourses } = useCompletedCoursesStore();
  const { setDegree, setCohort, setDegreeType, setCareer } =
    useRoadmapSelectsStore();

  const isMobile = useMediaQuery("(max-width: 640px)");

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

  const FileInput = () => (
    <input
      type="file"
      accept="application/json"
      hidden
      onChange={handleFileChange}
    />
  );

  const MobileButton = () => (
    <IconButton
      sx={{ border: "1px solid lightgrey", padding: "0.5rem" }}
      size="small"
      color="inherit"
      component="label"
    >
      <FileUploadOutlinedIcon fontSize="small" color="primary" />
      <FileInput />
    </IconButton>
  );

  const DesktopButton = () => (
    <Button
      variant="outlined"
      disableElevation
      component="label"
      startIcon={<FileUploadOutlinedIcon sx={{ width: "0.9em" }} />}
      size="small"
      sx={{
        textTransform: "none",
        borderRadius: "0.9rem",
        padding: "0.4rem 1rem",
      }}
    >
      Import
      <FileInput />
    </Button>
  );

  return (
    <TheTooltip title={TOOLTIP_TEXT}>
      {isMobile ? <MobileButton /> : <DesktopButton />}
    </TheTooltip>
  );
});

export default ImportButton;
