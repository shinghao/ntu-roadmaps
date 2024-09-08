import { useState } from "react";
import Roadmap from "@components/Roadmap";
import { Container } from "@mui/material";
import "./roadmapPage.css";
import CourseModal from "@components/Roadmap/CourseModal";
import { ReactFlowProvider } from "@xyflow/react";
import useFetchDegreeProgrammes from "@hooks/useFetchDegreeProgrammes";
import useFetchCareers from "@hooks/useFetchCareers";
import useFetchRoadmap from "@hooks/useFetchRoadmap";
import RoadmapSelects from "@components/RoadmapSelects";
import { Elective } from "@customTypes/course";
import { ExportData } from "@customTypes/index";
import { useCompletedCourses } from "@components/Roadmap/hooks/useCompletedCourses";

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
  const [selectedElectives, setSelectedElectives] = useState<Elective[]>([]);

  const { fetchedRoadmapData, error, isLoading } = useFetchRoadmap(
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
    setCareer("");
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
      options: cohort && degreeType ? careerOptions || [] : [],
      label: "Career",
      value: career,
      onChange: onChangeCareer,
    },
  ];

  const { importCompletedCourses } = useCompletedCourses();

  const onImport = (data: ExportData) => {
    setDegree(data.degree);
    setCohort(data.cohort);
    setDegreeType(data.degreeType);
    onChangeCareer(data.career);
    importCompletedCourses(data.completedCourses);
    setSelectedElectives(data.selectedElectives);
  };

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
          setSelectedElectives={setSelectedElectives}
        />
        <RoadmapSelects selectsConfig={selectsConfig} />
        {degree && cohort && career && isLoading && <p>{"Loading..."}</p>}
        {error && <p>{`Error: ${error}. Please try again`}</p>}
        {!error &&
          career &&
          fetchedRoadmapData &&
          fetchedRoadmapData?.coursesByYearSemester.length > 0 && (
            <Roadmap
              degree={degree}
              cohort={cohort}
              career={career}
              degreeType={degreeType}
              handleOnOpenCourseModal={handleOnOpenCourseModal}
              onImport={onImport}
              selectedElectives={selectedElectives}
              isEdgesHidden={isEdgesHidden}
              setIsEdgesHidden={setIsEdgesHidden}
              fetchedRoadmapData={fetchedRoadmapData}
            />
          )}
        {(!degree || !cohort || !degreeType || !career) && (
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
