import { fetchCourseDetails } from "@api/index";
import { useState, useEffect } from "react";

export default function useFetchCourseDetails(courseCode: string) {
  const [fetchedCourseDetails, setFetchedCourseDetails] =
    useState<Models.Course | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!courseCode) return;

      setIsLoading(true);
      setError("");
      try {
        const response = await fetchCourseDetails(courseCode);
        if (response === null) {
          throw new Error();
        }
        setFetchedCourseDetails(response);
      } catch (error) {
        console.error("Error fetching courses data", error);
        setError("Error fetching course data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [courseCode]);

  return { fetchedCourseDetails, error, isLoading };
}
