import "./LegendNode.css";

const LegendNode = () => {
  return (
    <div className="legend-container">
      <div className="legend-item">
        <span className="legend-prerequisite-line"></span>
        <span>Compulsory prerequisite</span>
      </div>
      <div className="legend-item">
        <span className="legend-prerequisite-dotted"></span>
        <span>Any prerequisite</span>
      </div>
    </div>
  );
};

export default LegendNode;
