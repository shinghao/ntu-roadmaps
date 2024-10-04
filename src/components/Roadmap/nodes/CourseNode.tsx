import { Handle, NodeProps, Position, Node } from "@xyflow/react";
import { CHILD_NODE_WIDTH, CHILD_NODE_HEIGHT } from "../Roadmap.constants";
import "./CourseNode.css";
import { Badge, Box, IconButton, Typography } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LockIcon from "@mui/icons-material/Lock";
import { ChangeEvent } from "react";
import ElectiveBtn from "@components/CurriculumTable/ElectiveBtn";
import useCourseModalStore from "@store/useCourseModalStore";
import useSelectCourseNode from "../hooks/useSelectCourseNode";
import useOnCheckCourseNode from "../hooks/useOnCheckCourseNode";
import { CourseInRoadmapType } from "@customTypes/roadmap";

export type CourseNode = Node<{
  id: string;
  courseCode: string;
  prerequisites: string[][];
  isAvailable: boolean;
  isCompleted: boolean;
  hasSourceHandle: boolean;
  hasTargetHandle: boolean;
  isHandlesHidden: boolean;
  isSelected: boolean;
  courseType: CourseInRoadmapType;
  title: string;
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
    isSelected = false,
    courseType = CourseInRoadmapType.Core,
    title = "",
  } = data;

  const { openCourseModal } = useCourseModalStore();
  const { onSelectCourseNode } = useSelectCourseNode();
  const { onNodeCheck } = useOnCheckCourseNode();

  const isElective = courseType === CourseInRoadmapType.Elective;

  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    onNodeCheck(e.target.checked, courseCode);
  };

  const backgroundColor = isSelected
    ? "#2B78E4"
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
    : "1px solid rgb(212, 212, 216)";
  const iconButtonBorderLeft = isAvailable
    ? "1px solid rgb(212, 212, 216)"
    : "1px solid rgba(0, 0, 0, 0.2)";
  const borderOnHover = "1px solid #2B78E4";
  const sourceHandleOpacity = hasSourceHandle ? 100 : 0;
  const targetHandleOpacity = hasTargetHandle ? 100 : 0;

  return (
    <>
      {isElective && (
        <Box sx={{ position: "absolute", bottom: "40px", left: "25px" }}>
          <Badge color="primary" badgeContent="Elective"></Badge>
        </Box>
      )}

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
        {isAvailable && title ? (
          <input
            aria-label={`checkbox for ${courseCode}`}
            type="checkbox"
            name={`checkbox-${id}`}
            checked={isCompleted}
            onChange={handleCheck}
            disabled={!isAvailable}
          />
        ) : (
          title && <LockIcon color="disabled" fontSize="small" />
        )}
        {title ? (
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
              {courseCode}
            </Typography>
          </button>
        ) : (
          <ElectiveBtn
            nodeId={id}
            electiveTitle="SELECT"
            sx={{ width: "100%" }}
          />
        )}
        {title && (
          <IconButton
            aria-label="view course details"
            size="small"
            onClick={() => openCourseModal(id, courseType)}
            sx={{
              borderLeft: iconButtonBorderLeft,
              paddingX: "0.6rem",
              borderRadius: "0",
              "&:hover": { borderBottom: "none" },
              height: "100%",
              marginLeft: "auto",
            }}
          >
            <KeyboardArrowRightIcon fontSize="medium" />
          </IconButton>
        )}
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
