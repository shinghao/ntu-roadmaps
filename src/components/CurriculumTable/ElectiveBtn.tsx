import { Button } from "@mui/material";
import useCourseModalStore from "@store/useCourseModalStore";

interface Props {
  nodeId: string;
  electiveTitle?: string;
}

const ElectiveBtn = ({ nodeId, electiveTitle }: Props) => {
  const { openCourseModal } = useCourseModalStore();

  return (
    <Button
      sx={{
        textTransform: "none",
      }}
      onClick={() => openCourseModal(nodeId, true)}
    >
      {electiveTitle || "SELECT ELECTIVE"}
    </Button>
  );
};

export default ElectiveBtn;
