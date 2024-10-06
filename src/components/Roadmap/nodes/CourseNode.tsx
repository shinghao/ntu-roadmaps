import { Handle, NodeProps, Position, Node } from "@xyflow/react";
import { CHILD_NODE_WIDTH, CHILD_NODE_HEIGHT } from "../Roadmap.constants";
import "./CourseNode.css";
import {
  Badge,
  Box,
  Checkbox,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LockIcon from "@mui/icons-material/Lock";
import { ChangeEvent } from "react";
import ElectiveBtn from "@components/CurriculumTable/ElectiveBtn";
import useCourseModalStore from "@store/useCourseModalStore";
import useOnCheckCourseNode from "../hooks/useOnCheckCourseNode";
import { CourseInRoadmapType } from "@customTypes/roadmap";
import { Check, CheckBoxOutlineBlankRounded } from "@mui/icons-material";
import { checkedCourseBg, completedCourseBg } from "../../../theme";
import TheTooltip from "@components/Tooltip";

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
  onSelectCourseNode: (id: string, isSelected: boolean) => void;
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
    onSelectCourseNode,
  } = data;

  const { openCourseModal } = useCourseModalStore();
  const { onNodeCheck } = useOnCheckCourseNode();

  const theme = useTheme();

  const isElective = courseType === CourseInRoadmapType.Elective;
  const isUnselectedElective = isElective && !title;

  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    onNodeCheck(e.target.checked, courseCode);
  };

  const backgroundColor = isSelected
    ? "#2B78E4"
    : isAvailable
    ? isCompleted
      ? completedCourseBg
      : "white"
    : "rgb(220, 220, 220)";
  const color = isSelected
    ? "white"
    : isAvailable
    ? isCompleted
      ? "black"
      : "black"
    : "black";
  const iconButtonBorderLeft = "1px solid rgba(0, 0, 0, 0.2)";
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

      <TheTooltip title={`${title}`} enterNextDelay={100} leaveTouchDelay={100}>
        <Box
          sx={{
            width: CHILD_NODE_WIDTH,
            maxWidth: "auto",
            height: CHILD_NODE_HEIGHT,
            backgroundColor: backgroundColor,
            "&:hover": { border: borderOnHover },
            paddingLeft: !isUnselectedElective ? "12px" : 0,
            display: "flex",
            border: "1px solid rgb(212, 212, 216)",
            cursor: "pointer",
            borderRadius: "8px",
            alignItems: "center",
          }}
        >
          {isAvailable && !isUnselectedElective ? (
            <Checkbox
              aria-label={`checkbox for ${courseCode}`}
              name={`checkbox-${id}`}
              checked={isCompleted}
              onChange={handleCheck}
              disabled={!isAvailable}
              sx={{
                padding: "0",
                color: theme.palette.grey[400],
                "&.Mui-checked": { background: checkedCourseBg },
                marginRight: "4px",
              }}
              checkedIcon={<Check sx={{ color: "white" }} />}
              icon={<CheckBoxOutlineBlankRounded />}
            />
          ) : (
            !isUnselectedElective && (
              <LockIcon
                color="disabled"
                fontSize="small"
                sx={{ padding: "2px", marginRight: "4px" }}
              />
            )
          )}
          {!isUnselectedElective ? (
            <button
              className="courseNode-btn"
              onClick={() => onSelectCourseNode(id, !isSelected)}
            >
              <Typography
                className="label"
                style={{ color: color }}
                fontSize="1.2em"
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
          {!isUnselectedElective && (
            <IconButton
              aria-label="view course details"
              size="small"
              onClick={() => openCourseModal(id, courseType)}
              color="primary"
              sx={{
                borderLeft: iconButtonBorderLeft,
                borderRadius: "0",
                "&:hover": { borderBottom: "none" },
                height: "100%",
                color: " rgba(0, 0, 0, 0.4)",
                width: "48px",
              }}
            >
              <KeyboardArrowRightIcon fontSize="large" />
            </IconButton>
          )}
        </Box>
      </TheTooltip>

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
