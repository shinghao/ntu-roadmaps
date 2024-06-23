import { useState } from "react";
import degreeProgrammes from "../data/degreeProgrammes.json";
import Roadmap from "@components/Roadmap";
import { Autocomplete, TextField, Stack } from "@mui/material";
import "./roadmapPage.css";
import CourseModal from "@components/Roadmap/CourseModal";

const typedDegreeProgrammes: {
  [degree: string]: {
    careers: string[];
  };
} = degreeProgrammes;

const cohorts = [
  "AY2023 & later",
  "AY2022",
  "AY2021",
  "AY2020",
  "AY2019",
  "AY2018",
];

export default function RoadmapPage() {
  const [degree, setDegree] = useState(Object.keys(typedDegreeProgrammes)[0]);
  const careers = typedDegreeProgrammes[degree].careers;
  const [career, setCareer] = useState<string>(careers[0] || "");
  const [cohort, setCohort] = useState(cohorts[0] || "");

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  const handleDegreeChange = (value: string) => {
    setDegree(value);
    const firstCareer = typedDegreeProgrammes[value]?.careers[0] || "";
    setCareer(firstCareer);
  };

  const handleOnOpenCourseModal = (id: string) => {
    setSelectedCourseId(id);
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
    <main className="content">
      <CourseModal
        courseId={selectedCourseId}
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
    </main>
  );
}
