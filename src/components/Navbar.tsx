import "./Navbar.css";

export default function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-content">
        {/* <img
          src="src\assets\ntu_logo.png"
          alt="ntu logo"
          className="ntu-logo"
        ></img> */}
        <a href="/" className="navbar-logo">
          NTUROADMAPS
        </a>
        <div>
          <button className="navbar-btn">Roadmaps</button>
          <button className="navbar-btn">Courses</button>
        </div>
      </div>
      <hr />
    </div>
  );
}
