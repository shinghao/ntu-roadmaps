import "reactflow/dist/style.css";
import "./App.css";
import { useState } from "react";
import Navbar from "./components/Navbar";
import degreeProgrammes from "./data/degreeProgrammes.json";
import RoadmapFlowchart from "./components/roadmap/Roadmap";
import LabelledSelect from "./components/LabelledSelect";
import Footer from "./components/Footer";

const typedDegreeProgrammes: {
  [degree: string]: {
    careers: string[];
  };
} = degreeProgrammes;

export default function Flow() {
  const [degree, setDegree] = useState<string>(
    Object.keys(typedDegreeProgrammes)[0]
  );

  const careers = typedDegreeProgrammes[degree].careers;
  const [career, setCareer] = useState<string>(careers[0] || "");

  return (
    <div className="app">
      <Navbar />
      <main className="content">
        <div className="selects-container">
          <LabelledSelect
            onChangeFn={(e) => setDegree(e.target.value)}
            options={Object.keys(degreeProgrammes)}
            selectName={"select-degree"}
            label={"Degree Programme"}
          />
          <LabelledSelect
            onChangeFn={(e) => setCareer(e.target.value)}
            options={careers}
            selectName={"select-career"}
            label={"Career"}
          />
        </div>
        <RoadmapFlowchart degree={degree} career={career} />
      </main>
      <Footer />
    </div>
  );
}
