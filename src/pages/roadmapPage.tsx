import { useCallback, useMemo, useState } from "react";
import RoadmapView from "@components/Roadmap";
import { Container } from "@mui/material";
import "./roadmapPage.css";
import CourseModal from "@components/Roadmap/CourseModal";
import { ReactFlowProvider } from "@xyflow/react";
import useFetchDegreeProgrammes from "@hooks/useFetchDegreeProgrammes";
import useFetchCareers from "@hooks/useFetchCareers";
import useFetchRoadmap from "@hooks/useFetchRoadmap";
import RoadmapSelects from "@components/RoadmapSelects";
import CurriculumTable from "@components/CurriculumTable";
import { Elective } from "@customTypes/course";
import {
  CourseInRoadmapType,
  ExportData,
  Roadmap,
  ViewFormat,
} from "@customTypes/index";
import RoadmapControlBar from "@components/RoadmapControlBar";

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
  const [viewFormat, setViewFormat] = useState(ViewFormat.Roadmap);

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

  const handleOnOpenCourseModal = useCallback(
    (nodeId: string, isElective: boolean) => {
      setIsSelectedCourseElective(isElective);
      setSelectedNodeId(nodeId);
      setIsCourseModalOpen(true);
    },
    []
  );

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

  // TODO:
  const roadmapData: Roadmap | undefined = useMemo(
    () =>
      fetchedRoadmapData
        ? {
            ...fetchedRoadmapData,
            coursesByYearSemester:
              fetchedRoadmapData?.coursesByYearSemester.map((yearSemester) => ({
                ...yearSemester,
                courses: yearSemester.courses.map((course) => {
                  const isElective =
                    course.type === CourseInRoadmapType.Elective;
                  const selectedElective = isElective
                    ? selectedElectives.find(
                        (elective) => elective.id === course.id
                      )
                    : undefined;

                  return {
                    ...course,
                    courseCode:
                      isElective && selectedElective
                        ? selectedElective.courseCode
                        : course.courseCode,
                    prerequisites:
                      isElective && selectedElective
                        ? selectedElective.prerequisites
                        : course.prerequisites,
                    title:
                      isElective && selectedElective
                        ? selectedElective.title
                        : course.title,
                    au:
                      isElective && selectedElective
                        ? selectedElective.au
                        : course.au,
                  };
                }),
              })),
          }
        : fetchedRoadmapData,
    [fetchedRoadmapData, selectedElectives]
  );

  const onImport = useCallback(
    () => (data: ExportData) => {
      setDegree(data.degree);
      setCohort(data.cohort);
      setDegreeType(data.degreeType);
      onChangeCareer(data.career);
      setSelectedElectives(data.selectedElectives);
    },
    [onChangeCareer]
  );

  const CurriculumView = () => {
    if (!roadmapData) {
      return;
    }

    return viewFormat === ViewFormat.Roadmap ? (
      <RoadmapView
        career={career}
        handleOnOpenCourseModal={handleOnOpenCourseModal}
        roadmapData={roadmapData}
      />
    ) : (
      <CurriculumTable
        career={career}
        handleOnOpenCourseModal={handleOnOpenCourseModal}
        roadmapData={roadmapData}
      />
    );
  };

  return (
    <ReactFlowProvider>
      <Container className="content">
        {isCourseModalOpen && roadmapData && (
          <CourseModal
            nodeId={selectedNodeId}
            isModalOpen={isCourseModalOpen}
            setIsModalOpen={setIsCourseModalOpen}
            isElective={isSelectedCourseElective}
            availableElectives={availableElectives}
            setSelectedElectives={setSelectedElectives}
            roadmapData={roadmapData}
          />
        )}
        <RoadmapSelects selectsConfig={selectsConfig} />
        {isLoading && <p>{"Loading..."}</p>}
        {error && <p>{`Error: ${error}. Please try again`}</p>}

        {career && roadmapData && (
          <>
            <RoadmapControlBar
              viewFormat={viewFormat}
              setViewFormat={setViewFormat}
              onImport={onImport}
              setSelectedElectives={setSelectedElectives}
              degree={degree}
              career={career}
              degreeType={degreeType}
              cohort={cohort}
              selectedElectives={selectedElectives}
            />
            <CurriculumView />
          </>
        )}

        {(!roadmapData || !career) && (
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
