import "./Header.css";

export default function Header() {
  return (
    <div className="navbar">
      <div className="navbar-content">
        <a href="/" className="navbar-logo">
          NTUROADMAPS
        </a>
        <div>
          <button className="navbar-btn">Roadmaps</button>
          <button className="navbar-btn">Courses</button>
        </div>
      </div>
    </div>
  );
}
