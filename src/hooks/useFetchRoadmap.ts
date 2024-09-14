import { fetchRoadmap } from "@api/index";
import { useQuery } from "@tanstack/react-query";

export default function useFetchRoadmap(
  degree: string,
  cohort: string,
  degreeType: string
) {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["roadmap", degree, cohort, degreeType],
    queryFn: () => fetchRoadmap(degree, cohort, degreeType),
    enabled: !!(degree && cohort && degreeType),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: 1,
  });

  return {
    fetchedRoadmapData: data,
    error,
    isLoading,
    isError,
  };
}
