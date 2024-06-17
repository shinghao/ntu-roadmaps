import "./Legend.css";

export default function Legend() {
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
}
