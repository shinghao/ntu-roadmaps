import { useState } from "react";
import Roadmap from "@components/Roadmap";
import { Autocomplete, TextField, Stack, Container } from "@mui/material";
import "./roadmapPage.css";
import CourseModal from "@components/Roadmap/CourseModal";
import { ReactFlowProvider } from "@xyflow/react";
import useFetchDegreeProgrammes from "@hooks/useFetchDegreeProgrammes";
import useFetchCareers from "@hooks/useFetchCareers";
import useFetchRoadmap from "@components/Roadmap/hooks/useFetchRoadmap";

const COHORTS = ["2023"];

export default function RoadmapPage() {
  const { degreeOptions } = useFetchDegreeProgrammes();
  const [degree, setDegree] = useState<string>(degreeOptions[0] ?? "");
  const { careerOptions, fetchedCareers } = useFetchCareers(degree);
  const [career, setCareer] = useState<string>("");
  const [cohort, setCohort] = useState("");

  const [isEdgesHidden, setIsEdgesHidden] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState("");
  const [isSelectedCourseElective, setIsSelectedCourseElective] =
    useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [availableElectives, setAvailableElectives] = useState<string[]>([]);

  const { fetchedRoadmapData, error, isLoading } = useFetchRoadmap(
    degree,
    cohort
  );

  const handleCareerChange = (value: string) => {
    setCareer(value);
    const selectedCareerElectives = fetchedCareers?.find(
      ({ career }) => career === value
    )?.electives;
    setAvailableElectives(selectedCareerElectives ?? []);
  };

  const handleDegreeChange = (value: string) => {
    setDegree(value);
  };

  const handleOnOpenCourseModal = (nodeId: string, isElective: boolean) => {
    setIsSelectedCourseElective(isElective);
    setSelectedNodeId(nodeId);
    setIsCourseModalOpen(true);
  };

  const updateSelects = (degree: string, career: string, cohort: string) => {
    setDegree(degree);
    setCareer(career);
    setCohort(cohort);
  };

  const selectsConfig = [
    {
      options: degreeOptions,
      label: "Degree",
      value: degree,
      onChange: handleDegreeChange,
      width: 300,
    },
    {
      options: careerOptions,
      label: "Career",
      value: career,
      onChange: handleCareerChange,
    },
    {
      options: COHORTS,
      label: "Cohort",
      value: cohort,
      onChange: setCohort,
    },
  ];

  return (
    <ReactFlowProvider>
      <Container className="content">
        <CourseModal
          nodeId={selectedNodeId}
          isModalOpen={isCourseModalOpen}
          setIsModalOpen={setIsCourseModalOpen}
          isElective={isSelectedCourseElective}
          availableElectives={availableElectives}
          isEdgesHidden={isEdgesHidden}
        />
        <Stack spacing={3} direction="row" flexWrap="wrap" useFlexGap>
          {selectsConfig.map((config) => (
            <Autocomplete
              freeSolo
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
        {isLoading && <p>{"Loading..."}</p>}
        {error && <p>{`Error: ${error}. Please try again`}</p>}
        {!error && fetchedRoadmapData?.coursesByYearSemester.length > 0 ? (
          <Roadmap
            degree={degree}
            career={career}
            cohort={cohort}
            handleOnOpenCourseModal={handleOnOpenCourseModal}
            updateSelects={updateSelects}
            isEdgesHidden={isEdgesHidden}
            setIsEdgesHidden={setIsEdgesHidden}
            fetchedRoadmapData={fetchedRoadmapData}
          />
        ) : (
          <p>
            Please select a {!degree ? "degree" : !career ? "career" : "cohort"}
          </p>
        )}
      </Container>
    </ReactFlowProvider>
  );
}
