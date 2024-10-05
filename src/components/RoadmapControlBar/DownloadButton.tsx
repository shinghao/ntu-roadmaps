import {
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
} from "@xyflow/react";
import { DOWNLOAD_IMAGE } from "../Roadmap/Roadmap.constants";
import DownloadIcon from "@mui/icons-material/Download";
import { toPng } from "html-to-image";
import TheTooltip from "@components/Tooltip";
import { Button, IconButton, useMediaQuery, useTheme } from "@mui/material";
import useRoadmapSelectsStore from "@store/useRoadmapSelectsStore";

const TOOLTIP_TEXT = "Download roadmap as PNG image";

function downloadImage(dataUrl: string, image_url: string) {
  const a = document.createElement("a");

  a.setAttribute("download", image_url);
  a.setAttribute("href", dataUrl);
  a.click();
}

function DownloadButton() {
  const { getNodes } = useReactFlow();
  const { degree, cohort, degreeType, career } = useRoadmapSelectsStore();
  const image_url = `${degree}-${cohort}-${degreeType}-${career}.png`;
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  const theme = useTheme();

  const onDownloadRoadmap = () => {
    const nodesBounds = getNodesBounds(getNodes());
    const { x, y, zoom } = getViewportForBounds(
      nodesBounds,
      DOWNLOAD_IMAGE.WIDTH,
      DOWNLOAD_IMAGE.HEIGHT,
      DOWNLOAD_IMAGE.MINZOOM,
      DOWNLOAD_IMAGE.MAXZOOM,
      DOWNLOAD_IMAGE.PADDING
    );

    toPng(document.querySelector(".react-flow__viewport") as HTMLElement, {
      backgroundColor: "white",
      width: DOWNLOAD_IMAGE.WIDTH,
      height: DOWNLOAD_IMAGE.HEIGHT,
      style: {
        width: `${DOWNLOAD_IMAGE.WIDTH}`,
        height: `${DOWNLOAD_IMAGE.HEIGHT}`,
        transform: `translate(${x / 2}px, ${y / 2}px) scale(${zoom})`,
      },
    }).then((dateUrl) => downloadImage(dateUrl, image_url));
  };

  return (
    <TheTooltip title={TOOLTIP_TEXT}>
      {isSmallScreen ? (
        <IconButton
          sx={{
            border: "1px solid lightgrey",
            padding: "0.5rem",
            backgroundColor: theme.palette.primary.main,
            "&:hover": { backgroundColor: theme.palette.primary.dark },
          }}
          size="small"
        >
          <DownloadIcon fontSize="small" sx={{ color: "white" }} />
        </IconButton>
      ) : (
        <Button
          variant="contained"
          disableElevation
          sx={{
            "&:hover": {
              borderBottom: "none",
            },
            textTransform: "none",
            borderRadius: "0.9rem",
            padding: "0.4rem 1rem",
          }}
          size="small"
          startIcon={<DownloadIcon sx={{ width: "0.9em" }} />}
          onClick={onDownloadRoadmap}
        >
          Download
        </Button>
      )}
    </TheTooltip>
  );
}

export default DownloadButton;
