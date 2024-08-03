import { useState } from "react";
import degreeProgrammes from "../data/degreeProgrammes.json";
import Roadmap from "@components/Roadmap";
import { Autocomplete, TextField, Stack, Container } from "@mui/material";
import "./roadmapPage.css";
import CourseModal from "@components/Roadmap/CourseModal";

const typedDegreeProgrammes: {
  [degree: string]: {
    careers: string[];
  };
} = degreeProgrammes;

const cohorts = ["2023"];

export default function RoadmapPage() {
  const [degree, setDegree] = useState(Object.keys(typedDegreeProgrammes)[0]);
  const careers = typedDegreeProgrammes[degree].careers;
  const [career, setCareer] = useState<string>(careers[0] || "");
  const [cohort, setCohort] = useState(cohorts[0] || "");

  const [selectedCourseCode, setSelectedCourseCode] = useState("");
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  const handleDegreeChange = (value: string) => {
    setDegree(value);
    const firstCareer = typedDegreeProgrammes[value]?.careers[0] || "";
    setCareer(firstCareer);
  };

  const handleOnOpenCourseModal = (courseCode: string) => {
    setSelectedCourseCode(courseCode);
    setIsCourseModalOpen(true);
  };

  const updateSelects = (degree: string, career: string, cohort: string) => {
    setDegree(degree);
    setCareer(career);
    setCohort(cohort);
  };

  const selectsConfig = [
    {
      options: Object.keys(degreeProgrammes),
      label: "Degree",
      value: degree,
      onChange: handleDegreeChange,
      width: 300,
    },
    {
      options: careers,
      label: "Career",
      value: career,
      onChange: setCareer,
    },
    {
      options: cohorts,
      label: "Cohort",
      value: cohort,
      onChange: setCohort,
    },
  ];

  return (
    <Container className="content">
      <CourseModal
        courseCode={selectedCourseCode}
        isModalOpen={isCourseModalOpen}
        setIsModalOpen={setIsCourseModalOpen}
      />
      <Stack spacing={3} direction="row" flexWrap="wrap" useFlexGap>
        {selectsConfig.map((config) => (
          <Autocomplete
            key={`select-${config.label}`}
            disablePortal
            id={`select-${config.label}`}
            options={config.options}
            sx={{ width: config.width || 200 }}
            renderInput={(params) => (
              <TextField {...params} label={config.label} />
            )}
            value={config.value}
            onChange={(_, value) => config.onChange(value)}
            disableClearable
          />
        ))}
      </Stack>
      <Roadmap
        degree={degree}
        career={career}
        cohort={cohort}
        handleOnOpenCourseModal={handleOnOpenCourseModal}
        updateSelects={updateSelects}
      />
    </Container>
  );
}
