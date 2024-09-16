import DownloadButton from "@components/RoadmapControlBar/DownloadButton";
import ExportButton from "@components/RoadmapControlBar/ExportButton";
import ImportButton from "@components/RoadmapControlBar/ImportButton";
import ResetButton from "@components/RoadmapControlBar/ResetButton";
import ViewToggle from "@components/ViewToggle";
import { ExportData, ViewFormat } from "@customTypes/index";
import { Stack, useMediaQuery } from "@mui/material";

interface Props {
  viewFormat: ViewFormat;
  setViewFormat: (viewFormat: ViewFormat) => void;
  onImport: (importedData: ExportData) => void;
  onReset: () => void;
  dataToExport: ExportData;
}

const RoadmapControlBar = ({
  viewFormat,
  setViewFormat,
  onImport,
  onReset,
  dataToExport,
}: Props) => {
  const isSmallScreen = useMediaQuery("(max-width: 640px)");

  return (
    <Stack
      direction={isSmallScreen ? "column" : "row"}
      flexWrap="wrap"
      marginY="24px"
      alignItems={isSmallScreen ? "flex-start" : "between"}
      justifyContent={isSmallScreen ? "flex-start" : "space-between"}
      spacing="12px"
      useFlexGap
    >
      <ViewToggle viewFormat={viewFormat} setViewFormat={setViewFormat} />
      <Stack
        spacing="12px"
        useFlexGap
        direction="row"
        flexWrap="wrap"
        alignItems="center"
        alignSelf="flex-start"
      >
        <ImportButton onImport={onImport} />
        <ExportButton dataToExport={dataToExport} />
        <DownloadButton />
        <ResetButton onReset={onReset} isSmallScreen={isSmallScreen} />
      </Stack>
    </Stack>
  );
};

export default RoadmapControlBar;
