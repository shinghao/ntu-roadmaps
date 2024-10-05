import {
  PARENT_NODE_HEIGHT,
  XPOS_BETWEEN_CHILD,
  CHILD_NODE_WIDTH,
  CHILD_XPOS_START,
} from "../Roadmap.constants";

// Pastel version
// const backgroundColors = [
//   "#D0CDF8",
//   "#BAE9D5",
//   "#EFC1C1",
//   "#F5DCBE",
//   "#F5DCBE",
// ];

const backgroundColors = [
  "#FFBB33",
  "#F99157",
  "#CC99CC",
  "#EC7272",
  "#92B4EC",
];

const SemesterNode = ({
  data,
}: {
  data: { label: string; noOfCourses: number };
}) => {
  const year = parseInt(data.label.split(" ")[1]) - 1;
  const childWidthAndSpace = XPOS_BETWEEN_CHILD + CHILD_NODE_WIDTH;
  const parentWidth =
    data.noOfCourses * childWidthAndSpace +
    CHILD_XPOS_START +
    CHILD_XPOS_START -
    XPOS_BETWEEN_CHILD;
  return (
    <div
      style={{
        color: "black",
        width: parentWidth,
        minWidth: "max-content",
        height: PARENT_NODE_HEIGHT,
        backgroundColor: backgroundColors[year],
        fontWeight: "bold",
        textAlign: "left",
        margin: "0 auto",
        zIndex: -1,
        fontSize: "1em",
        padding: `10px ${CHILD_XPOS_START}px`,
        borderRadius: "1rem",
        border: `1px solid ${backgroundColors[year]}`,
      }}
    >
      {data.label}
    </div>
  );
};

export default SemesterNode;
