import { getRectOfNodes, getTransformForBounds, Node } from "reactflow";
import { DOWNLOAD_IMAGE } from "./Roadmap.constants";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { toPng } from "html-to-image";

export default function DownloadButton({ nodes }: { nodes: Node[] }) {
  const handleDownloadRoadmap = () => {
    const nodesBounds = getRectOfNodes(nodes);
    const transform = getTransformForBounds(
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
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
    }).then((dataUrl) => {
      const a = document.createElement("a");
      a.setAttribute("download", "my-course-roadmap.png");
      a.setAttribute("href", dataUrl);
      a.click();
    });
  };

  return (
    <Button
      variant="contained"
      startIcon={<DownloadIcon />}
      onClick={handleDownloadRoadmap}
    >
      Download (PNG)
    </Button>
  );
}
