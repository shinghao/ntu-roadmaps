import { useCallback, useMemo, useState } from "react";
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

  const degreeOptions = useMemo(
    () =>
      fetchedDegreeProgrammes
        ? fetchedDegreeProgrammes.map(({ degree }) => degree).sort()
        : [],
    [fetchedDegreeProgrammes]
  );

  const selectedDegreeProgram = useMemo(
    () =>
      fetchedDegreeProgrammes?.find((degProg) => degProg.degree === degree) ??
      null,
    [fetchedDegreeProgrammes, degree]
  );

  const cohortOptions = useMemo(
    () =>
      selectedDegreeProgram
        ? Object.keys(selectedDegreeProgram.cohorts).sort()
        : [],
    [selectedDegreeProgram]
  );

  const degreeTypeOptions = useMemo(
    () =>
      cohort && selectedDegreeProgram
        ? selectedDegreeProgram?.cohorts?.[cohort]
        : [],
    [cohort, selectedDegreeProgram]
  );

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

  const onChangeCareer = useCallback(
    (value: string) => {
      setCareer(value);
      const selectedCareerElectives = fetchedCareers?.find(
        ({ career }) => career === value
      )?.electives;
      setAvailableElectives(selectedCareerElectives ?? []);
    },
    [fetchedCareers]
  );

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

  const onImport = useCallback(
    () => (data: ExportData) => {
      setDegree(data.degree);
      setCohort(data.cohort);
      setDegreeType(data.degreeType);
      onChangeCareer(data.career);
      importCompletedCourses(data.completedCourses);
      setSelectedElectives(data.selectedElectives);
    },
    [importCompletedCourses, onChangeCareer]
  );

  return (
    <ReactFlowProvider>
      <Container className="content">
        {isCourseModalOpen && (
          <CourseModal
            nodeId={selectedNodeId}
            isModalOpen={isCourseModalOpen}
            setIsModalOpen={setIsCourseModalOpen}
            isElective={isSelectedCourseElective}
            availableElectives={availableElectives}
            setSelectedElectives={setSelectedElectives}
          />
        )}
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
              setSelectedElectives={setSelectedElectives}
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
