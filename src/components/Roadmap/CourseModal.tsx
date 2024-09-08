import "./CourseModal.css";
import PrerequisiteGraph from "./PrerequisiteGraph";
import { Button, Drawer, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useFetchCourseDetails from "@hooks/useFetchCourseDetails";
import { useEffect, useMemo, useState } from "react";
import SelectElective from "./SelectElective";
import { useReactFlow } from "@xyflow/react";
import { Course, Elective } from "@customTypes/index";

interface Props {
  nodeId: string;
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  isElective: boolean;
  availableElectives: string[];
  isEdgesHidden: boolean;
  setSelectedElectives: React.Dispatch<React.SetStateAction<Elective[]>>;
}

export default function CourseModal({ setSelectedElectives, ...props }: Props) {
  const { getNode, getNodes } = useReactFlow();
  const selectedNode = getNode(props.nodeId);

  const [selectedElective, setSelectedElective] = useState<string>(
    selectedNode?.data?.courseCode as string
  );

  const effectiveCourseCode = useMemo(
    () =>
      props.isElective && selectedElective
        ? selectedElective
        : (selectedNode?.data?.courseCode as string) ?? "",
    [props.isElective, selectedElective, selectedNode]
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
    au = "",
    title = "",
    description = "",
    intendedLearningOutcomes = [],
    semesters = [],
    prerequisites = [[]],
  } = (fetchedCourseDetails as Course) ?? {};

  const onCloseModal = () => {
    setSelectedElective("");
    props.setIsModalOpen(false);
  };

  const coursesInRoadmap = useMemo(
    () =>
      getNodes()
        .filter(
          (node) => node.type === "courseNode" && node.id !== props.nodeId
        )
        .map(({ data }) => data.courseCode as string),
    [getNodes, props.nodeId]
  );

  useEffect(() => {
    if (!selectedElective) {
      return;
    }
    const newSelectedElective: Elective = {
      id: props.nodeId,
      courseCode: selectedElective,
      prerequisites: prerequisites.flat(),
    };

    setSelectedElectives((prevSelectedElectives: Elective[]) => {
      const existingSelectedElective = prevSelectedElectives.findIndex(
        (elective) => elective.id === props.nodeId
      );
      if (existingSelectedElective !== -1) {
        return prevSelectedElectives.map((elective, index) =>
          index === existingSelectedElective ? newSelectedElective : elective
        );
      }
      return [...prevSelectedElectives, newSelectedElective];
    });
  }, [prerequisites, props.nodeId, selectedElective, setSelectedElectives]);

  const onSelectElective = (elective: string) => {
    setSelectedElective(elective);
  };

  return (
    <Drawer open={props.isModalOpen} onClose={onCloseModal} anchor="right">
      <div className="modal-container">
        <Button
          variant="outlined"
          color="error"
          startIcon={<ArrowBackIcon />}
          onClick={onCloseModal}
        >
          ESC
        </Button>

        {props.isElective && (
          <SelectElective
            selectedElective={effectiveCourseCodeValue}
            onSelectElective={onSelectElective}
            availableElectives={props.availableElectives}
            disabledOptions={coursesInRoadmap}
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
            <PrerequisiteGraph
              courseId={courseCode}
              prerequisites={prerequisites.map((prereq) => prereq[0]) || []}
            />
          </div>
        )}
      </div>
    </Drawer>
  );
}
