import { fetchCourseDetails } from "@api/index";
import { useQuery } from "@tanstack/react-query";

export default function useFetchCourseDetails(courseCode: string) {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["courseDetails", courseCode],
    queryFn: () => fetchCourseDetails(courseCode),
    enabled: !!courseCode,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: 1,
  });

  return { fetchedCourseDetails: data, error, isLoading, isError };
}
