import "./CourseModal.css";
import PrerequisiteGraph from "./PrerequisiteGraph";
import { Button, Drawer, Divider, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useFetchCourseDetails from "@hooks/useFetchCourseDetails";
import { useEffect, useMemo, useState } from "react";
import SelectElective from "./SelectElective";
import {
  Course,
  CourseInRoadmapType,
  Elective,
  Roadmap,
} from "@customTypes/index";
import useCourseModalStore from "@store/useCourseModalStore";

interface Props {
  availableElectives: string[];
  setSelectedElectives: React.Dispatch<React.SetStateAction<Elective[]>>;
  roadmapData: Roadmap;
}

export default function CourseModal({
  setSelectedElectives,
  roadmapData,
  ...props
}: Props) {
  const { isCourseModalOpen, closeCourseModal, selectedNodeId, courseType } =
    useCourseModalStore();

  const isElective = courseType === CourseInRoadmapType.Elective;
  const isBde = courseType === CourseInRoadmapType.Bde;

  const coursesInRoadmap = useMemo(() => {
    return roadmapData.coursesByYearSemester.flatMap(
      (yearSemester) => yearSemester.courses
    );
  }, [roadmapData]);

  const selectedNode = coursesInRoadmap.find(
    (course) => course.id === selectedNodeId
  );

  const [selectedElective, setSelectedElective] = useState<string>(
    selectedNode?.courseCode as string
  );

  const effectiveCourseCode = useMemo(
    () =>
      isElective && selectedElective
        ? selectedElective
        : (selectedNode?.courseCode as string) ?? "",
    [isElective, selectedElective, selectedNode]
  );

  const effectiveCourseCodeValue = useMemo(
    () => (effectiveCourseCode.includes("xxx") ? "" : effectiveCourseCode),
    [effectiveCourseCode]
  );

  const { fetchedCourseDetails } = useFetchCourseDetails(
    effectiveCourseCodeValue
  );

  const {
    courseCode = "",
    au = undefined,
    title = "",
    description = "",
    intendedLearningOutcomes = [],
    semesters = [],
    prerequisites = [[]],
  } = (fetchedCourseDetails as Course) ?? {};

  const onCloseModal = () => {
    setSelectedElective("");
    closeCourseModal();
  };

  useEffect(() => {
    if (!selectedElective || !fetchedCourseDetails || !isElective) {
      return;
    }
    fetchedCourseDetails;
    const newSelectedElective: Elective = {
      id: selectedNodeId || "",
      courseCode: selectedElective,
      prerequisites: fetchedCourseDetails?.prerequisites.flat() || [],
      title: fetchedCourseDetails?.title || "",
      au: fetchedCourseDetails?.au,
    };

    setSelectedElectives((prevSelectedElectives: Elective[]) => {
      const existingSelectedElective = prevSelectedElectives.findIndex(
        (elective) => elective.id === selectedNodeId
      );
      if (existingSelectedElective !== -1) {
        return prevSelectedElectives.map((elective, index) =>
          index === existingSelectedElective ? newSelectedElective : elective
        );
      }
      return [...prevSelectedElectives, newSelectedElective];
    });
  }, [
    fetchedCourseDetails,
    isElective,
    selectedNodeId,
    selectedElective,
    setSelectedElectives,
  ]);

  const onSelectElective = (elective: string) => {
    setSelectedElective(elective);
  };

  return (
    <Drawer open={isCourseModalOpen} onClose={onCloseModal} anchor="right">
      <div className="modal-container">
        <Button
          variant="outlined"
          color="error"
          startIcon={<ArrowBackIcon />}
          onClick={onCloseModal}
        >
          ESC
        </Button>

        {isElective && (
          <SelectElective
            selectedElective={effectiveCourseCodeValue}
            onSelectElective={onSelectElective}
            availableElectives={props.availableElectives}
            disabledOptions={coursesInRoadmap.map(
              ({ courseCode }) => courseCode
            )}
          />
        )}

        <h2>
          {effectiveCourseCode}
          {title ? ` - ${title}` : ""}
        </h2>

        {courseCode && (
          <div>
            <p>{au || "?"} AU</p>
            {(semesters?.length ?? 0) > 0 && (
              <p>Semesters: {semesters.join(", ")}</p>
            )}
            {description && (
              <>
                <Divider />
                <p>{description}</p>
              </>
            )}
            {(intendedLearningOutcomes?.length ?? 0) > 0 && (
              <div>
                <Divider />
                <h3>Intended Learning Outcomes</h3>
                <ol>
                  {intendedLearningOutcomes.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ol>
              </div>
            )}
            <Divider />
            {!isBde && (
              <PrerequisiteGraph
                courseId={courseCode}
                prerequisites={prerequisites.map((prereq) => prereq[0]) || []}
              />
            )}
          </div>
        )}

        {(isBde || (!isElective && !title)) && (
          <Box
            margin="0 auto"
            marginTop="3rem"
            textAlign={"center"}
            fontSize="1.25em"
            width="12rem"
            padding="0.8rem"
            borderRadius="1rem"
            sx={{ backgroundColor: "#FFE3A9" }}
          >
            Coming Soon! 🚀
          </Box>
        )}
      </div>
    </Drawer>
  );
}
