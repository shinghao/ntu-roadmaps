import { fetchDegreeProgrammes } from "@api/index";
import { useQuery } from "@tanstack/react-query";

export default function useFetchDegreeProgrammes() {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["fetchDegreeProgrammes"],
    queryFn: fetchDegreeProgrammes,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: 1,
  });

  return {
    fetchedDegreeProgrammes: data,
    error,
    isLoading,
    isError,
  };
}
