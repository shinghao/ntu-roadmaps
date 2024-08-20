import { fetchCareers } from "@api/index";
import { useQuery } from "@tanstack/react-query";

export default function useFetchCareers(degree: string) {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["careerOptions", degree],
    queryFn: () => fetchCareers(degree),
  });

  return {
    fetchedCareers: data,
    careerOptions: data?.map(({ career }) => career).sort(),
    error,
    isPending,
    isError,
  };
}
