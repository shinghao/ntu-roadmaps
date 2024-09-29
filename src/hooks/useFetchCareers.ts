import { fetchCareers } from "@api/index";
import useRoadmapSelectsStore from "@store/useRoadmapSelectsStore";
import { useQuery } from "@tanstack/react-query";

export default function useFetchCareers() {
  const { degree } = useRoadmapSelectsStore();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["careerOptions", degree],
    queryFn: () => fetchCareers(degree),
    enabled: !!degree,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: 1,
  });

  return {
    fetchedCareers: data,
    careerOptions: data?.map(({ career }) => career).sort(),
    error,
    isLoading,
    isError,
  };
}
