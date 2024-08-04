import { fetchCareers } from "@api/index";
import { useState, useEffect } from "react";

export default function useFetchCareers(degree: string) {
  const [fetchedCareers, setFetchedCareers] = useState<Models.Career[] | null>(
    null
  );
  const [careerOptions, setCareerOptions] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetchCareers(degree);
        if (response === null) {
          throw new Error();
        }
        setFetchedCareers(response);
        setCareerOptions(response.map(({ career }) => career).sort());
      } catch (error) {
        console.error("Error fetching courses data", error);
        setError("Error fetching course data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [degree]);

  return { fetchedCareers, careerOptions, error, isLoading };
}
