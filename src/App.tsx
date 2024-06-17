import "reactflow/dist/style.css";
import "./App.css";
import { useState, useRef } from "react";
import Navbar from "./components/Navbar";
import degreeProgrammes from "./data/degreeProgrammes.json";
import RoadmapFlowchart from "./components/roadmap/Roadmap";
import LabelledSelect from "./components/LabelledSelect";
import Footer from "./components/Footer";
import CourseModal from "./components/roadmap/CourseModal";

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
  const cohorts = [
    "AY2018",
    "AY2019",
    "AY2020",
    "AY2021",
    "AY2022",
    "AY2023 & later",
  ];
  const [selectedCohort, setSelectedCohort] = useState(cohorts[0] || "");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const dialogRef = useRef(null);
  const handleShowModal = (courseId: string): void => {
    dialogRef.current.showModal();
    setSelectedCourseId(courseId);
  };

  return (
    <div className="app">
      <CourseModal courseId={selectedCourseId} dialogRef={dialogRef} />
      <Navbar />
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
        <RoadmapFlowchart
          degree={degree}
          career={career}
          cohort={selectedCohort}
          handleShowModal={handleShowModal}
        />
      </main>
      <Footer />
    </div>
  );
}
