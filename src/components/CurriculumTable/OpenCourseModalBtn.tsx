import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import useCourseModalStore from "@store/useCourseModalStore";

interface Props {
  nodeId: string;
  isElective: boolean;
}

const OpenCourseModalBtn = ({ nodeId, isElective }: Props) => {
  const { openCourseModal } = useCourseModalStore();

  return (
    <IconButton
      aria-label="view course details"
      size="small"
      onClick={() => openCourseModal(nodeId, isElective)}
      sx={{
        paddingX: "0.6rem",
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
