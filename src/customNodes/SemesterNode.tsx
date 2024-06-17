import { Handle, Position } from "reactflow";

const SemesterNode = ({ data }) => {
  return (
    <>
      <div style={{ padding: "10px 20px" }}>{data.label}</div>

      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default SemesterNode;
