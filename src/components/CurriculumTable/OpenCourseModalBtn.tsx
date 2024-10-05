import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import useCourseModalStore from "@store/useCourseModalStore";
import { CourseInRoadmapType } from "@customTypes/index";

interface Props {
  nodeId: string;
  courseType: CourseInRoadmapType;
}

const OpenCourseModalBtn = ({ nodeId, courseType }: Props) => {
  const { openCourseModal } = useCourseModalStore();

  return (
    <IconButton
      aria-label="view course details"
      size="small"
      onClick={() => openCourseModal(nodeId, courseType)}
      sx={{
        marginRight: "-0.1rem",
        borderRadius: "0",
        "&:hover": { borderBottom: "none" },
        height: "100%",
      }}
    >
      <VisibilityIcon />
    </IconButton>
  );
};

export default OpenCourseModalBtn;
