import { fetchDegreeProgrammes } from "@api/index";
import { useQuery } from "@tanstack/react-query";

export default function useFetchDegreeProgrammes() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["fetchDegreeProgrammes"],
    queryFn: fetchDegreeProgrammes,
  });

  return {
    fetchedDegreeProgrammes: data,
    error,
    isPending,
    isError,
  };
}
