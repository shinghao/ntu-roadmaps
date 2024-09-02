import { Handle, NodeProps, Position, Node } from "@xyflow/react";
import { CHILD_NODE_WIDTH, CHILD_NODE_HEIGHT } from "../Roadmap.constants";
import "./CourseNode.css";
import { Box, IconButton, Typography } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LockIcon from "@mui/icons-material/Lock";
import { ChangeEvent } from "react";

export type CourseNode = Node<{
  id: string;
  courseCode: string;
  prerequisites: string[][];
  isAvailable: boolean;
  isCompleted: boolean;
  hasSourceHandle: boolean;
  hasTargetHandle: boolean;
  isHandlesHidden: boolean;
  onCheck: (checked: boolean, courseCode: string) => void;
  handleOnOpenCourseModal: (nodeId: string, isElective: boolean) => void;
  onSelectCourseNode: (id: string, isSelected: boolean) => void;
  isSelected: boolean;
  isElective: boolean;
}>;

export type CourseNodeData = CourseNode["data"];

const CourseNode = ({ data }: NodeProps<CourseNode>) => {
  const {
    id,
    courseCode,
    isAvailable = false,
    isCompleted = false,
    hasSourceHandle = true,
    hasTargetHandle = true,
    isHandlesHidden,
    onCheck,
    handleOnOpenCourseModal,
    onSelectCourseNode,
    isSelected = false,
    isElective = false,
  } = data;

  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    onCheck(e.target.checked, courseCode);
  };

  const nodeLabel = courseCode;
  const backgroundColor = isSelected
    ? "#1976d2"
    : isAvailable
    ? isCompleted
      ? "whitesmoke"
      : "white"
    : "rgb(200, 200, 200)";
  const color = isSelected
    ? "white"
    : isAvailable
    ? isCompleted
      ? "grey"
      : "black"
    : "rgba(0, 0, 0, 0.4)";
  const border = isAvailable
    ? "1px solid rgb(212, 212, 216)"
    : "1px solid rgb(200, 200, 200)";
  const iconButtonBorderLeft = isAvailable
    ? "1px solid rgb(212, 212, 216)"
    : "1px solid rgba(0, 0, 0, 0.2)";
  const borderOnHover = "1px solid #1976d2";
  const sourceHandleOpacity = hasSourceHandle ? 100 : 0;
  const targetHandleOpacity = hasTargetHandle ? 100 : 0;

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
          onClick={() => handleOnOpenCourseModal(id, isElective)}
          sx={{
            borderLeft: iconButtonBorderLeft,
            paddingX: "0.6rem",
            borderRadius: "0",
            "&:hover": { borderBottom: "none" },
            height: "100%",
          }}
        >
          <KeyboardArrowRightIcon />
        </IconButton>
      </Box>

      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#2B78E4", opacity: targetHandleOpacity }}
        isConnectable={false}
        hidden={isHandlesHidden}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#2B78E4", opacity: sourceHandleOpacity }}
        isConnectable={false}
        hidden={isHandlesHidden}
      />
    </>
  );
};

export default CourseNode;
