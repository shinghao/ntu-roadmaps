import { create } from "zustand";

interface CourseModalState {
  isEdgesHidden: boolean;
  setIsEdgesHidden: (isEdgesHidden: boolean) => void;
  toggleEdgesHidden: () => void;
}

const useIsEdgesHiddenStore = create<CourseModalState>((set) => ({
  isEdgesHidden: true,
  setIsEdgesHidden: (isEdgesHidden: boolean) => set({ isEdgesHidden }),
  toggleEdgesHidden: () =>
    set((state) => ({ isEdgesHidden: !state.isEdgesHidden })),
}));

export default useIsEdgesHiddenStore;
