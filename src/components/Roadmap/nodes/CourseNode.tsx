import { Handle, Position } from "@xyflow/react";
import { CHILD_NODE_WIDTH, CHILD_NODE_HEIGHT } from "../Roadmap.constants";
import "./CourseNode.css";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import LockIcon from "@mui/icons-material/Lock";

interface CourseNodeProps {
  data: {
    id: string;
    courseCode: string;
    isAvailable: boolean;
    isCompleted: boolean;
    hasSourceHandle: boolean;
    hasTargetHandle: boolean;
    isHandlesHidden: boolean;
    onCheck: (id: string) => void;
    handleOnOpenCourseModal: (courseCode: string) => void;
    onSelectCourseNode: (id: string, isSelected: boolean) => void;
    isSelected: boolean;
  };
}

const CourseNode = ({ data }: CourseNodeProps) => {
  const {
    id,
    courseCode,
    isAvailable = false,
    isCompleted = false,
    hasSourceHandle = false,
    hasTargetHandle = false,
    isHandlesHidden,
    onCheck,
    handleOnOpenCourseModal,
    onSelectCourseNode,
    isSelected = false,
  } = data;

  const handleCheck = () => {
    onCheck(id);
  };

  const nodeLabel = courseCode;
  const backgroundColor = isSelected
    ? "#1976d2"
    : isAvailable
    ? isCompleted
      ? "whitesmoke"
      : "white"
    : "rgb(175, 175, 175)";
  const color = isAvailable
    ? isCompleted
      ? "grey"
      : "black"
    : "rgba(0, 0, 0, 0.4)";
  const border = isAvailable
    ? "1px solid rgb(212, 212, 216)"
    : "1px solid grey";
  const iconButtonBorderLeft = isAvailable
    ? "1px solid rgb(212, 212, 216)"
    : "1px solid rgba(0, 0, 0, 0.2)";
  const borderOnHover = "1px solid #1976d2";

  return (
    <>
      <Box
        className="courseNode"
        sx={{
          width: CHILD_NODE_WIDTH,
          maxWidth: "auto",
          height: CHILD_NODE_HEIGHT,
          backgroundColor: backgroundColor,
          border,
          "&:hover": { border: borderOnHover },
        }}
      >
        {isAvailable ? (
          <input
            type="checkbox"
            name={`checkbox-${id}`}
            checked={isCompleted}
            onChange={handleCheck}
            disabled={!isAvailable}
          />
        ) : (
          <LockIcon color="disabled" fontSize="small" />
        )}
        <button
          className="courseNode-btn"
          onClick={() => onSelectCourseNode(id, !isSelected)}
        >
          <Typography
            className="label"
            style={{
              textDecoration: isCompleted ? "line-through" : "none",
              color: color,
            }}
          >
            {nodeLabel}
          </Typography>
        </button>
        <IconButton
          aria-label="view course details"
          size="small"
          onClick={() => handleOnOpenCourseModal(courseCode)}
          sx={{
            borderLeft: iconButtonBorderLeft,
            paddingX: "0.6rem",
            borderRadius: "0",
            "&:hover": { borderBottom: "none" },
            height: "100%",
          }}
        >
          <ArrowCircleRightIcon />
        </IconButton>
      </Box>
      {hasTargetHandle && (
        <Handle
          type="target"
          position={Position.Top}
          style={{ background: "#2B78E4" }}
          isConnectable={false}
          hidden={isHandlesHidden}
        />
      )}
      {hasSourceHandle && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ background: "#2B78E4" }}
          isConnectable={false}
          hidden={isHandlesHidden}
        />
      )}
    </>
  );
};

export default CourseNode;
