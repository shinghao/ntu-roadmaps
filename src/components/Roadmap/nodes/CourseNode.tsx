import { Handle, Position } from "reactflow";
import { useState } from "react";
import { CHILD_NODE_WIDTH, CHILD_NODE_HEIGHT } from "../Roadmap.constants";
import "./CourseNode.css";

const CourseNode = ({ data }: { data: { courseCode: string; id: string } }) => {
  const [isChecked, setIsChecked] = useState(false);

  const nodeLabel = data.courseCode;
  const backgroundColor = isChecked ? "whitesmoke" : "white";
  const color = isChecked ? "grey" : "black";

  return (
    <>
      <div
        className="courseNode"
        style={{
          width: CHILD_NODE_WIDTH,
          maxWidth: "auto",
          height: CHILD_NODE_HEIGHT,
          backgroundColor: backgroundColor,
          color: color,
        }}
      >
        <input
          type="checkbox"
          name={`checkbox-${data.id}`}
          onChange={() => setIsChecked(!isChecked)}
        />
        <button className="courseNode-btn">
          <span
            className="label"
            style={{ textDecoration: isChecked ? "line-through" : "none" }}
          >
            {nodeLabel}
          </span>
          <span className="arrow">→</span>
        </button>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        style={{
          stroke: "#2B78E4",
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          stroke: "#2B78E4",
        }}
      />
    </>
  );
};

export default CourseNode;
