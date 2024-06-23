import { Handle, Position } from "reactflow";
import { CHILD_NODE_WIDTH, CHILD_NODE_HEIGHT } from "../Roadmap.constants";
import "./CourseNode.css";
import { IconButton } from "@mui/material";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

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
    handleOnSelectCourseNode: (id: string) => void;
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
    handleOnSelectCourseNode,
  } = data;

  const handleCheck = () => {
    onCheck(id);
  };

  const nodeLabel = courseCode;
  const backgroundColor = isAvailable
    ? isCompleted
      ? "whitesmoke"
      : "white"
    : "grey";
  const color = isCompleted ? "grey" : "black";

  return (
    <>
      <div
        className="courseNode"
        style={{
          width: CHILD_NODE_WIDTH,
          maxWidth: "auto",
          height: CHILD_NODE_HEIGHT,
          backgroundColor: backgroundColor,
        }}
      >
        <input
          type="checkbox"
          name={`checkbox-${id}`}
          checked={isCompleted}
          onChange={handleCheck}
          disabled={!isAvailable}
        />
        <button className="courseNode-btn">
          <span
            className="label"
            style={{
              textDecoration: isCompleted ? "line-through" : "none",
              color: color,
            }}
          >
            {nodeLabel}
          </span>
        </button>
        <IconButton
          aria-label="view course details"
          size="small"
          onClick={() => handleOnSelectCourseNode(id)}
          sx={{
            borderLeft: "1px solid rgb(212, 212, 216)",
            paddingX: "0.6rem",
            borderRadius: "0",
            "&:hover": { borderBottom: "none" },
          }}
        >
          <ArrowCircleRightIcon />
        </IconButton>
      </div>
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
