import {
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
} from "@xyflow/react";
import { DOWNLOAD_IMAGE } from "../Roadmap/Roadmap.constants";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { toPng } from "html-to-image";
import TheTooltip from "@components/Tooltip/Tooltip";

const IMAGE_URL = "my-course-roadmap.png";
const TOOLTIP_TEXT = "Download roadmap as PNG image";

function downloadImage(dataUrl: string) {
  const a = document.createElement("a");

  a.setAttribute("download", IMAGE_URL);
  a.setAttribute("href", dataUrl);
  a.click();
}

function DownloadButton() {
  const { getNodes } = useReactFlow();
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
    }).then(downloadImage);
  };

  return (
    <TheTooltip title={TOOLTIP_TEXT}>
      <Button
        variant="contained"
        disableElevation
        startIcon={<DownloadIcon />}
        onClick={onDownloadRoadmap}
        sx={{
          "&:hover": {
            borderBottom: "none",
          },
        }}
        size="small"
      >
        Download
      </Button>
    </TheTooltip>
  );
}

export default DownloadButton;