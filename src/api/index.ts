import axios from "axios";
const BACKEND_URL = "ntu-roadmaps.azurewebsites.net/api";

export const fetchCourseDetails = async (
  courseCode: string
): Promise<Models.Course | null> => {
  const url = `${BACKEND_URL}/course/${courseCode}`;
  const response = await axios.get(url);
  return response.data;
};

export const fetchRoadmap = async (
  degree: string,
  cohort: string,
  degreeType: string
): Promise<Models.Roadmap> => {
  const url = `${BACKEND_URL}/roadmap/${degree}/${cohort}/${degreeType}`;
  const response = await axios.get(url);
  return response.data;
};

export const fetchDegreeProgrammes =
  async (): Promise<Models.GetDegreeProgrammesResp> => {
    const url = `${BACKEND_URL}/degrees`;
    const response = await axios.get(url);
    return response.data;
  };

export const fetchCareers = async (
  degree: string
): Promise<Models.Career[]> => {
  const url = `${BACKEND_URL}/careers/${degree}`;
  const response = await axios.get(url);
  return response.data;
};
