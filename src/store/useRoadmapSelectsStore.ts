import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RoadmapSelectsState {
  degree: string;
  cohort: string;
  degreeType: string;
  career: string;
  setDegree: (degree: string) => void;
  setCohort: (cohort: string) => void;
  setDegreeType: (degreeType: string) => void;
  setCareer: (career: string) => void;
  resetAll: () => void;
}

const useRoadmapSelectsStore = create<RoadmapSelectsState>()(
  persist(
    (set) => ({
      degree: "",
      cohort: "",
      degreeType: "",
      career: "",
      setDegree: (degree: string) =>
        set({ degree, cohort: "", degreeType: "", career: "" }),
      setCohort: (cohort: string) =>
        set({ cohort, degreeType: "", career: "" }),
      setDegreeType: (degreeType: string) => set({ degreeType }),
      setCareer: (career: string) => set({ career }),
      resetAll: () => {
        set({ degree: "" });
        set({ cohort: "" });
        set({ degreeType: "" });
        set({ career: "" });
      },
    }),
    {
      name: "roadmap-selects",
    }
  )
);

export default useRoadmapSelectsStore;
