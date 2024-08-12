import { useState, useEffect } from "react";
import { fetchRoadmap } from "@api/index";

export default function useFetchRoadmap(
  degree: string,
  cohort: string,
  degreeType: string
) {
  const [fetchedRoadmapData, setFetchedRoadmapData] = useState<Models.Roadmap>({
    degree,
    cohort,
    coursesByYearSemester: [],
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const roadmapResponse = await fetchRoadmap(degree, cohort, degreeType);
        setFetchedRoadmapData(roadmapResponse);
      } catch (error) {
        console.error("Error fetching roadmap data", error);
        setError("Error fetching roadmap data");
      } finally {
        setIsLoading(false);
      }
    };

    if (!degree || !cohort || !degreeType) {
      return;
    }
    fetchData();
  }, [degree, cohort, degreeType]);

  return { fetchedRoadmapData, error, isLoading, setFetchedRoadmapData };
}
