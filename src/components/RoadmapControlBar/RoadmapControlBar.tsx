import DownloadButton from "@components/RoadmapControlBar/DownloadButton";
import ExportButton from "@components/RoadmapControlBar/ExportButton";
import ImportButton from "@components/RoadmapControlBar/ImportButton";
import ResetButton from "@components/RoadmapControlBar/ResetButton";
import ViewToggle from "@components/ViewToggle";
import { Elective, ExportData, ViewFormat } from "@customTypes/index";
import { Stack } from "@mui/material";

interface Props {
  viewFormat: ViewFormat;
  setViewFormat: (viewFormat: ViewFormat) => void;
  onImport: (importedData: ExportData) => void;
  setSelectedElectives: (electives: Elective[]) => void;
  selectedElectives: Elective[];
}

const RoadmapControlBar = ({
  viewFormat,
  setViewFormat,
  onImport,
  setSelectedElectives,

  selectedElectives,
}: Props) => {
  // const isSmallScreen = useMediaQuery("(max-width: 640px)");

  return (
    <Stack
      direction={"row"}
      flexWrap="wrap"
      marginY="24px"
      alignItems={"between"}
      justifyContent={"space-between"}
      spacing="8px"
      useFlexGap
      sx={{ height: "100%" }}
    >
      <ViewToggle viewFormat={viewFormat} setViewFormat={setViewFormat} />
      <Stack
        spacing="8px"
        useFlexGap
        direction="row"
        flexWrap="wrap"
        alignItems="center"
      >
        <ResetButton setSelectedElectives={setSelectedElectives} />
        <ImportButton onImport={onImport} />
        <ExportButton selectedElectives={selectedElectives} />
        {viewFormat === ViewFormat.Roadmap && <DownloadButton />}
      </Stack>
    </Stack>
  );
};

export default RoadmapControlBar;
