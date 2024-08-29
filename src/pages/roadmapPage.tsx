import { useState } from "react";
import Roadmap from "@components/Roadmap";
import { Container, ToggleButton, ToggleButtonGroup } from "@mui/material";
import "./roadmapPage.css";
import CourseModal from "@components/Roadmap/CourseModal";
import { ReactFlowProvider } from "@xyflow/react";
import useFetchDegreeProgrammes from "@hooks/useFetchDegreeProgrammes";
import useFetchCareers from "@hooks/useFetchCareers";
import useFetchRoadmap from "@hooks/useFetchRoadmap";
import RoadmapSelects from "@components/Roadmap/RoadmapSelects";
import CurriculumTable from "@components/CurriculumTable";

export default function RoadmapPage() {
  const { fetchedDegreeProgrammes } = useFetchDegreeProgrammes();
  const [degree, setDegree] = useState<string>("");
  const [career, setCareer] = useState<string>("");
  const [cohort, setCohort] = useState("");
  const [degreeType, setDegreeType] = useState("");
  const { careerOptions, fetchedCareers } = useFetchCareers(degree);
  const [isEdgesHidden, setIsEdgesHidden] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState("");
  const [isSelectedCourseElective, setIsSelectedCourseElective] =
    useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [availableElectives, setAvailableElectives] = useState<string[]>([]);

  enum ViewFormat {
    Roadmap = "Roadmap",
    Table = "Table",
  }

  const [viewFormat, setViewFormat] = useState(ViewFormat.Roadmap);

  const { fetchedRoadmapData, error, isPending } = useFetchRoadmap(
    degree,
    cohort,
    degreeType
  );

  const degreeOptions = fetchedDegreeProgrammes
    ? fetchedDegreeProgrammes.map(({ degree }) => degree).sort()
    : [];

  const selectedDegreeProgram =
    fetchedDegreeProgrammes?.find((degProg) => degProg.degree === degree) ??
    null;

  const cohortOptions = selectedDegreeProgram
    ? Object.keys(selectedDegreeProgram.cohorts).sort()
    : [];

  const degreeTypeOptions =
    cohort && selectedDegreeProgram
      ? selectedDegreeProgram?.cohorts?.[cohort]
      : [];

  const onChangeDegree = (value: string) => {
    setDegree(value);
    setCohort("");
    setDegreeType("");
  };

  const onChangeCohort = (value: string) => {
    setCohort(value);
    setDegreeType("");
  };

  const onChangeCareer = (value: string) => {
    setCareer(value);
    const selectedCareerElectives = fetchedCareers?.find(
      ({ career }) => career === value
    )?.electives;
    setAvailableElectives(selectedCareerElectives ?? []);
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
      options: degreeOptions || [],
      label: "Degree",
      value: degree,
      onChange: onChangeDegree,
      width: 300,
    },
    {
      options: cohortOptions || [],
      label: "Cohort",
      value: cohort,
      onChange: onChangeCohort,
    },
    {
      options: degreeTypeOptions || [],
      label: "Degree Type",
      value: degreeType,
      onChange: setDegreeType,
    },
    {
      options: careerOptions || [],
      label: "Career",
      value: career,
      onChange: onChangeCareer,
    },
  ];

  const RoadmapView = () => {
    if (
      !fetchedRoadmapData ||
      fetchedRoadmapData?.coursesByYearSemester.length === 0
    ) {
      return;
    }

    return viewFormat === ViewFormat.Roadmap ? (
      <Roadmap
        degree={degree}
        cohort={cohort}
        career={career}
        handleOnOpenCourseModal={handleOnOpenCourseModal}
        updateSelects={updateSelects}
        isEdgesHidden={isEdgesHidden}
        setIsEdgesHidden={setIsEdgesHidden}
        fetchedRoadmapData={fetchedRoadmapData}
      />
    ) : (
      <CurriculumTable
        degree={degree}
        cohort={cohort}
        career={career}
        handleOnOpenCourseModal={handleOnOpenCourseModal}
        updateSelects={updateSelects}
        fetchedRoadmapData={fetchedRoadmapData}
        key={`${degree}-${cohort}-${career}-curriculumTable`}
      />
    );
  };

  const ViewToggle = () =>
    !error &&
    fetchedRoadmapData &&
    fetchedRoadmapData?.coursesByYearSemester.length > 0 && (
      <ToggleButtonGroup
        value={viewFormat}
        exclusive
        onChange={(_, newAlignment: ViewFormat) => {
          setViewFormat(newAlignment);
        }}
        aria-label="view format"
        size="small"
        sx={{ marginTop: "24px" }}
        color="standard"
      >
        {Object.values(ViewFormat).map((key) => (
          <ToggleButton value={ViewFormat[key]} key={key}>
            {ViewFormat[key]}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    );

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
        <RoadmapSelects selectsConfig={selectsConfig} />
        {degree && cohort && career && isPending && <p>{"Loading..."}</p>}
        {error && <p>{`Error: ${error}. Please try again`}</p>}

        {!error &&
        fetchedRoadmapData &&
        fetchedRoadmapData?.coursesByYearSemester.length > 0 ? (
          <>
            <ViewToggle />
            <RoadmapView />
          </>
        ) : (
          <p>
            Please select a{" "}
            {!degree
              ? "degree"
              : !cohort
              ? "cohort"
              : !degreeType
              ? "degree type"
              : "career"}
          </p>
        )}
      </Container>
    </ReactFlowProvider>
  );
}
