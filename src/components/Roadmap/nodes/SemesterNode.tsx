import {
  PARENT_NODE_HEIGHT,
  XPOS_BETWEEN_CHILD,
  CHILD_NODE_WIDTH,
} from "../Roadmap.constants";

const backgroundColors = [
  "beige",
  "lightblue",
  "pink",
  "lightsalmon",
  "lightcoral",
];

const SemesterNode = ({
  data,
}: {
  data: { label: string; noOfCourses: number };
}) => {
  const year = parseInt(data.label.split(" ")[1]) - 1;
  const childWidthAndSpace = XPOS_BETWEEN_CHILD + CHILD_NODE_WIDTH;
  const parentWidth =
    data.noOfCourses * childWidthAndSpace + XPOS_BETWEEN_CHILD;
  return (
    <div
      style={{
        width: parentWidth,
        minWidth: "max-content",
        height: PARENT_NODE_HEIGHT,
        backgroundColor: backgroundColors[year],
        fontWeight: "bold",
        textAlign: "left",
        margin: "0 auto",
        zIndex: -1,
        fontSize: "1em",
        padding: "10px",
        borderRadius: "0.3rem",
        border: "1px solid lightgrey",
        borderRight: "none",
      }}
    >
      {data.label}
    </div>
  );
};

export default SemesterNode;
