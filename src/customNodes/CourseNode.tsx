import { Handle, Position } from "reactflow";
import { useState } from "react";
import "./CourseNode.css";

const CHILD_NODE_WIDTH = 600;
const CHILD_NODE_HEIGHT = 50;

const CourseNode = ({
  data,
}: {
  data: {
    courseCode: string;
    courseName: string;
    id: string;
    handleShowModal: () => void;
  };
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const nodeLabel = `${data.courseCode} ${
    data.courseName ? " - " + data.courseName : ""
  }`;

  const handleClick = () => {
    data.handleShowModal();
  };

  return (
    <>
      <div className="courseNode">
        <input
          type="checkbox"
          name={`checkbox-${data.id}`}
          onChange={() => setIsChecked(!isChecked)}
        />
        <button
          className="courseNode-btn"
          style={{
            width: CHILD_NODE_WIDTH - 50,
            height: CHILD_NODE_HEIGHT,
            backgroundColor: isChecked ? "whitesmoke" : "white",
            color: isChecked ? "grey" : "black",
          }}
          onClick={handleClick}
        >
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
        type="source"
        position={Position.Right}
        style={{
          stroke: "#2B78E4",
        }}
      />
      <Handle
        type="target"
        position={Position.Right}
        style={{
          stroke: "#2B78E4",
        }}
      />
    </>
  );
};

export default CourseNode;
