import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const OpenCourseModalBtn = ({
  courseCode,
  handleOnOpenCourseModal,
}: {
  courseCode: string;
  handleOnOpenCourseModal: (nodeId: string, isElective: boolean) => void;
}) => (
  <IconButton
    aria-label="view course details"
    size="small"
    onClick={() =>
      handleOnOpenCourseModal(courseCode, courseCode.includes("xxx"))
    }
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

export default OpenCourseModalBtn;
