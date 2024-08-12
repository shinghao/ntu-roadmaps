import { fetchDegreeProgrammes } from "@api/index";
import { useState, useEffect } from "react";

export default function useFetchDegreeProgrammes() {
  const [fetchedDegreeProgrammes, setFetchedDegreeProgrammes] =
    useState<Models.GetDegreeProgrammesResp>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetchDegreeProgrammes();
        if (response === null) {
          throw new Error();
        }
        setFetchedDegreeProgrammes(response);
      } catch (error) {
        console.error("Error fetching courses data", error);
        setError("Error fetching course data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { fetchedDegreeProgrammes, error, isLoading };
}
