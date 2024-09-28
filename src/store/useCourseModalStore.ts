import { create } from "zustand";

interface CourseModalState {
  isCourseModalOpen: boolean;
  isSelectedCourseElective: boolean;
  selectedNodeId: string | null;
  openCourseModal: (nodeId: string, isElective: boolean) => void;
  closeCourseModal: () => void;
}

const useCourseModalStore = create<CourseModalState>((set) => ({
  isCourseModalOpen: false,
  isSelectedCourseElective: false,
  selectedNodeId: null,
  openCourseModal: (nodeId: string, isElective: boolean) =>
    set({
      isCourseModalOpen: true,
      isSelectedCourseElective: isElective,
      selectedNodeId: nodeId,
    }),
  closeCourseModal: () =>
    set({
      isCourseModalOpen: false,
      selectedNodeId: null,
      isSelectedCourseElective: false,
    }),
}));

export default useCourseModalStore;
