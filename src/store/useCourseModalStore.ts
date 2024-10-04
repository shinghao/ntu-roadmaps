import { CourseInRoadmapType } from "@customTypes/roadmap";
import { create } from "zustand";

interface CourseModalState {
  isCourseModalOpen: boolean;
  courseType: CourseInRoadmapType | null;
  selectedNodeId: string | null;
  openCourseModal: (nodeId: string, courseType: CourseInRoadmapType) => void;
  closeCourseModal: () => void;
}

const useCourseModalStore = create<CourseModalState>((set) => ({
  isCourseModalOpen: false,
  courseType: null,
  selectedNodeId: null,
  openCourseModal: (nodeId: string, courseType: CourseInRoadmapType) =>
    set({
      isCourseModalOpen: true,
      courseType,
      selectedNodeId: nodeId,
    }),
  closeCourseModal: () =>
    set({
      isCourseModalOpen: false,
      courseType: null,
      selectedNodeId: null,
    }),
}));

export default useCourseModalStore;
