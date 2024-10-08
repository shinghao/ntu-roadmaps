import { fetchCourseDetails } from "@api/index";
import useRoadmapSelectsStore from "@store/useRoadmapSelectsStore";
import { useQuery } from "@tanstack/react-query";

export default function useFetchCourseDetails(courseCode: string) {
  const { cohort } = useRoadmapSelectsStore();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["courseDetails", courseCode],
    queryFn: () => fetchCourseDetails(courseCode),
    enabled: !!courseCode,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: 1,
  });

  // TODO: Temporary added hard coded implementation for MH1810, as it is no longer a prerequisite in AY2024
  if (cohort === "2024" && data?.prerequisites.flat().includes("MH1810")) {
    data.prerequisites = data.prerequisites
      .map((prereqArray) => prereqArray.filter((prereq) => prereq !== "MH1810")) // Remove "MH1810"
      .filter((prereqArray) => prereqArray.length > 0); // Filter out empty arrays

    console.log(data);
  }

  return { fetchedCourseDetails: data, error, isLoading, isError };
}
