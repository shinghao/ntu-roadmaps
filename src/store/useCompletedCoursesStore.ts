import { create } from "zustand";

const KEY = "completed-courses";

const removeDuplicates = (arr: string[]): string[] => [...new Set(arr)];

export const getCompletedCourses = (): string[] => {
  const value = window.localStorage.getItem(KEY);
  return value ? JSON.parse(value) : [];
};

interface CompletedCoursesState {
  completedCourses: string[];
  addCompletedCourse: (courseCode: string) => void;
  removeCompletedCourse: (courseCode: string) => void;
  resetCompletedCourse: () => void;
  importCompletedCourses: (courseCodes: string[]) => void;
  isCourseCompleted: (courseCode: string) => boolean;
}

export const useCompletedCoursesStore = create<CompletedCoursesState>(
  (set) => ({
    completedCourses: getCompletedCourses(),

    addCompletedCourse: (courseCode: string) =>
      set((state) => {
        if (!state.completedCourses.includes(courseCode)) {
          const newCourses = [...state.completedCourses, courseCode];
          localStorage.setItem(
            KEY,
            JSON.stringify(removeDuplicates(newCourses))
          );
          return { completedCourses: newCourses };
        }
        return state;
      }),

    removeCompletedCourse: (courseCode: string) =>
      set((state) => {
        const newCourses = state.completedCourses.filter(
          (val) => val !== courseCode
        );
        localStorage.setItem(KEY, JSON.stringify(removeDuplicates(newCourses)));
        return { completedCourses: newCourses };
      }),

    resetCompletedCourse: () => {
      localStorage.removeItem(KEY); // Clear storage
      set({ completedCourses: [] });
    },

    importCompletedCourses: (courseCodes: string[]) => {
      const uniqueCourses = removeDuplicates(courseCodes);
      localStorage.setItem(KEY, JSON.stringify(uniqueCourses));
      set({ completedCourses: uniqueCourses });
    },

    isCourseCompleted: (courseCode: string) => {
      const completedCourses = getCompletedCourses();
      return completedCourses.includes(courseCode);
    },
  })
);
