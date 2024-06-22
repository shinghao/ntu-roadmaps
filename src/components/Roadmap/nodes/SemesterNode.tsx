import { PARENT_NODE_HEIGHT } from "../Roadmap.constants";

const backgroundColors = [
  "beige",
  "lightblue",
  "pink",
  "lightsalmon",
  "lightcoral",
];

const SemesterNode = ({ data }: { data: { label: string } }) => {
  const year = parseInt(data.label.split(" ")[1]) - 1;

  return (
    <div
      style={{
        minWidth: "max-content",
        height: PARENT_NODE_HEIGHT,
        backgroundColor: backgroundColors[year],
        fontWeight: "bold",
        textAlign: "left",
        margin: "0 auto",
        zIndex: -1,
        fontSize: "1em",
        padding: "10px",
        border: "1px solid lightgrey",
        borderRadius: "0.3rem",
      }}
    >
      {data.label}
    </div>
  );
};

export default SemesterNode;
