import { fetchRoadmap } from "@api/index";
import useRoadmapSelectsStore from "@store/useRoadmapSelectsStore";
import { useQuery } from "@tanstack/react-query";

export default function useFetchRoadmap() {
  const { degree, cohort, degreeType } = useRoadmapSelectsStore();

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
