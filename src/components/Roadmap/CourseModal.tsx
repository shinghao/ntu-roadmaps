import "./CourseModal.css";
import PrerequisiteGraph from "./PrerequisiteGraph";
import { Button, Drawer, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useFetchCourseDetails from "@hooks/useFetchCourseDetails";
import { useEffect, useState } from "react";
import SelectElective from "./SelectElective";
import { useReactFlow } from "@xyflow/react";
import { useUpdateNodeData } from "./hooks/useUpdateNodeData";
import {
  isCourseCompleted,
  isPrerequisitesCompleted,
} from "./util/buildRoadmap.util";

interface Props {
  nodeId: string;
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  isElective: boolean;
  availableElectives: string[];
  isEdgesHidden: boolean;
}

export default function CourseModal(props: Props) {
  const { getNode, getNodes } = useReactFlow();
  const selectedNode = getNode(props.nodeId);
  const { updateNodeData } = useUpdateNodeData();

  const [selectedElective, setSelectedElective] = useState<string>(
    selectedNode?.data?.courseCode as string
  );

  const effectiveCourseCode =
    props.isElective && selectedElective
      ? selectedElective
      : (selectedNode?.data?.courseCode as string) ?? "";

  const effectiveCourseCodeValue = effectiveCourseCode.includes("xxx")
    ? ""
    : effectiveCourseCode;

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
  } = (fetchedCourseDetails as Models.Course) ?? {};

  useEffect(() => {
    if (!selectedElective) {
      return;
    }
    updateNodeData(
      props.nodeId,
      {
        courseCode: selectedElective,
        prerequisites,
        isAvailable: isPrerequisitesCompleted(selectedElective),
        isCompleted: isCourseCompleted(selectedElective),
      },
      props.isEdgesHidden
    );
  }, [
    selectedElective,
    prerequisites,
    updateNodeData,
    props.nodeId,
    props.isEdgesHidden,
  ]);

  const onCloseModal = () => {
    setSelectedElective("");
    props.setIsModalOpen(false);
  };

  const coursesInRoadmap = getNodes()
    .filter((node) => node.type === "courseNode" && node.id !== props.nodeId)
    .map(({ data }) => data.courseCode as string);

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
            onSelectElective={setSelectedElective}
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
