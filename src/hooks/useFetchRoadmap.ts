import { fetchRoadmap } from "@api/index";
import { useQuery } from "@tanstack/react-query";

export default function useFetchRoadmap(
  degree: string,
  cohort: string,
  degreeType: string
) {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["roadmap", degree, cohort, degreeType],
    queryFn: () => fetchRoadmap(degree, cohort, degreeType),
  });

  return {
    fetchedRoadmapData: data,
    error,
    isPending,
    isError,
  };
}
