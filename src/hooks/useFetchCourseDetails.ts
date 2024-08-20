import { fetchCourseDetails } from "@api/index";
import { useQuery } from "@tanstack/react-query";

export default function useFetchCourseDetails(courseCode: string) {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["courseDetails", courseCode],
    queryFn: () => fetchCourseDetails(courseCode),
  });

  return { fetchedCourseDetails: data, error, isPending, isError };
}
