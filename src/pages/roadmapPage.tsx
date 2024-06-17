import { useState } from "react";
import degreeProgrammes from "../data/degreeProgrammes.json";
import Roadmap from "../components/Roadmap";
import LabelledSelect from "../components/Roadmap/LabelledSelect";
import "./roadmapPage.css";

const typedDegreeProgrammes: {
  [degree: string]: {
    careers: string[];
  };
} = degreeProgrammes;

export default function RoadmapPage() {
  const [degree, setDegree] = useState<string>(
    Object.keys(typedDegreeProgrammes)[0]
  );
  const careers = typedDegreeProgrammes[degree].careers;
  const [career, setCareer] = useState<string>(careers[0] || "");
  const cohorts = [
    "AY2018",
    "AY2019",
    "AY2020",
    "AY2021",
    "AY2022",
    "AY2023 & later",
  ];
  const [selectedCohort, setSelectedCohort] = useState(cohorts[0] || "");

  return (
    <main className="content">
      <div className="selects-container">
        <LabelledSelect
          onChangeFn={(e) => setDegree(e.target.value)}
          options={Object.keys(degreeProgrammes)}
          selectName={"select-degree"}
          label={"Degree"}
        />
        <LabelledSelect
          onChangeFn={(e) => setCareer(e.target.value)}
          options={careers}
          selectName={"select-career"}
          label={"Career"}
        />
        <LabelledSelect
          onChangeFn={(e) => setSelectedCohort(e.target.value)}
          options={cohorts}
          selectName={"select-cohort"}
          label={"Cohort"}
        />
      </div>
      <Roadmap degree={degree} career={career} cohort={selectedCohort} />
    </main>
  );
}
