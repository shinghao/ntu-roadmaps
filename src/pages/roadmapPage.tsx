import { useCallback, useMemo, useState } from "react";
import RoadmapView from "@components/Roadmap";
import { Container } from "@mui/material";
import "./roadmapPage.css";
import CourseModal from "@components/Roadmap/CourseModal";
import { ReactFlowProvider } from "@xyflow/react";
import useFetchRoadmap from "@hooks/useFetchRoadmap";
import RoadmapSelects from "@components/RoadmapSelects";
import CurriculumTable from "@components/CurriculumTable";
import { Elective } from "@customTypes/course";
import { ExportData, Roadmap, ViewFormat } from "@customTypes/index";
import RoadmapControlBar from "@components/RoadmapControlBar";
import useFetchCareers from "@hooks/useFetchCareers";
import useRoadmapSelectsStore from "@store/useRoadmapSelectsStore";

export default function RoadmapPage() {
  const { fetchedCareers } = useFetchCareers();
  const { career } = useRoadmapSelectsStore();

  const [availableElectives, setAvailableElectives] = useState<string[]>([]);
  const [selectedElectives, setSelectedElectives] = useState<Elective[]>([]);
  const [viewFormat, setViewFormat] = useState(ViewFormat.Roadmap);

  const { fetchedRoadmapData, error } = useFetchRoadmap();

  const roadmapData: Roadmap | undefined = useMemo(() => {
    if (!fetchedRoadmapData) {
      return undefined;
    }
    return {
      ...fetchedRoadmapData,
      coursesByYearSemester: fetchedRoadmapData?.coursesByYearSemester.map(
        (yearSemester) => ({
          ...yearSemester,
          courses: yearSemester.courses.map((course) => {
            const selectedElective = selectedElectives.find(
              (elective) => elective.id === course.id
            );
            return { ...course, ...selectedElective };
          }),
        })
      ),
    };
  }, [fetchedRoadmapData, selectedElectives]);

  const onImport = useCallback(
    () => (data: ExportData) => {
      const selectedCareerElectives = fetchedCareers?.find(
        ({ career }) => career === data.career
      )?.electives;
      setAvailableElectives(selectedCareerElectives ?? []);
      setSelectedElectives(data.selectedElectives);
    },
    [fetchedCareers]
  );

  return (
    <ReactFlowProvider>
      <Container className="content">
        {roadmapData && (
          <CourseModal
            availableElectives={availableElectives}
            setSelectedElectives={setSelectedElectives}
            roadmapData={roadmapData}
          />
        )}
        <RoadmapSelects setAvailableElectives={setAvailableElectives} />
        {error && <p>{`Error: ${error}. Please try again`}</p>}
        {career && roadmapData && (
          <>
            <RoadmapControlBar
              viewFormat={viewFormat}
              setViewFormat={setViewFormat}
              onImport={onImport}
              setSelectedElectives={setSelectedElectives}
              selectedElectives={selectedElectives}
            />
            {viewFormat === ViewFormat.Roadmap ? (
              <RoadmapView roadmapData={roadmapData} />
            ) : (
              <CurriculumTable roadmapData={roadmapData} />
            )}
          </>
        )}
      </Container>
    </ReactFlowProvider>
  );
}
