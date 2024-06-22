import { useState, useEffect } from "react";
import { fetchRoadmap } from "@api/index";

export default function useFetchRoadmap(
  degree: string,
  career: string,
  cohort: string
) {
  const [fetchedRoadmapData, setFetchedRoadmapData] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const roadmapResponse = await fetchRoadmap(degree, career, cohort);
        setFetchedRoadmapData(roadmapResponse);
      } catch (error) {
        console.error("Error fetching roadmap data", error);
        setError("Error fetching roadmap data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [degree, career, cohort]);

  return { fetchedRoadmapData, error, isLoading };
}
