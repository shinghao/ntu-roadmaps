import { CourseInRoadmapType } from "@customTypes/roadmap";
import { Button, SxProps } from "@mui/material";
import useCourseModalStore from "@store/useCourseModalStore";

interface Props {
  nodeId: string;
  electiveTitle?: string;
  sx?: SxProps;
}

const ElectiveBtn = ({ nodeId, electiveTitle, sx, ...props }: Props) => {
  const { openCourseModal } = useCourseModalStore();

  return (
    <Button
      sx={{
        textTransform: "none",
        ...sx,
        fontSize: "1em",
      }}
      onClick={() => openCourseModal(nodeId, CourseInRoadmapType.Elective)}
      {...props}
    >
      {electiveTitle || "SELECT ELECTIVE"}
    </Button>
  );
};

export default ElectiveBtn;
