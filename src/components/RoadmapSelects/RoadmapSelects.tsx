import useFetchCareers from "@hooks/useFetchCareers";
import useFetchDegreeProgrammes from "@hooks/useFetchDegreeProgrammes";
import { Stack, Autocomplete, TextField } from "@mui/material";
import useRoadmapSelectsStore from "@store/useRoadmapSelectsStore";
import { useCallback, useEffect, useMemo, useRef } from "react";

export default function RoadmapSelects({
  setAvailableElectives,
}: {
  setAvailableElectives: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const { fetchedDegreeProgrammes } = useFetchDegreeProgrammes();
  const {
    degree,
    cohort,
    degreeType,
    career,
    setDegree,
    setCohort,
    setDegreeType,
    setCareer,
  } = useRoadmapSelectsStore();
  const { careerOptions, fetchedCareers } = useFetchCareers();

  // Scroll roadmap selects out of view after user finish all selects
  const ref = useRef<HTMLDivElement | null>(null);
  const scrollOutOfView = useCallback(() => {
    if (ref.current) {
      const elementTop =
        ref.current.getBoundingClientRect().top + window.scrollY;
      const scrollTarget = elementTop - window.innerHeight;

      window.scrollTo({
        top: -scrollTarget,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    const selectedCareerElectives = fetchedCareers?.find(
      (fetchedCareer) => fetchedCareer.career === career
    )?.electives;
    setAvailableElectives(selectedCareerElectives?.sort() ?? []);
  }, [career, fetchedCareers, setAvailableElectives]);

  const degreeOptions = useMemo(
    () =>
      fetchedDegreeProgrammes
        ? fetchedDegreeProgrammes.map(({ degree }) => degree).sort()
        : [],
    [fetchedDegreeProgrammes]
  );

  const selectedDegreeProgram = useMemo(
    () =>
      fetchedDegreeProgrammes?.find((degProg) => degProg.degree === degree) ??
      null,
    [fetchedDegreeProgrammes, degree]
  );

  const cohortOptions = useMemo(
    () =>
      selectedDegreeProgram
        ? Object.keys(selectedDegreeProgram.cohorts).sort()
        : [],
    [selectedDegreeProgram]
  );

  const degreeTypeOptions = useMemo(
    () =>
      cohort && selectedDegreeProgram
        ? selectedDegreeProgram?.cohorts?.[cohort]
        : [],
    [cohort, selectedDegreeProgram]
  );

  const onChangeCareer = useCallback(
    (value: string) => {
      setCareer(value);
      scrollOutOfView();
    },
    [setCareer, scrollOutOfView]
  );

  const selectsConfig = [
    {
      options: degreeOptions || [],
      label: "Degree",
      value: degree,
      onChange: setDegree,
      width: 300,
    },
    {
      options: cohortOptions || [],
      label: "Cohort",
      value: cohort,
      onChange: setCohort,
    },
    {
      options: degreeTypeOptions || [],
      label: "Degree Type",
      value: degreeType,
      onChange: setDegreeType,
    },
    {
      options: cohort && degreeType ? careerOptions || [] : [],
      label: "Career",
      value: career,
      onChange: onChangeCareer,
    },
  ];

  return (
    <>
      <Stack ref={ref} spacing={3} direction="row" flexWrap="wrap" useFlexGap>
        {selectsConfig
          .filter((config) => !config.options || config.options.length > 0) // Filter out configs that have previous requirements
          .map((config) => (
            <Autocomplete
              key={`select-${config.label}`}
              disablePortal
              id={`select-${config.label}`}
              options={config.options}
              sx={{
                width: {
                  sm: config.width || 200,
                  xs: "100%",
                },
              }}
              renderInput={(params) => (
                <TextField {...params} label={config.label} />
              )}
              value={config.value}
              onChange={(_, value) => config.onChange(value)}
              disableClearable
            />
          ))}
      </Stack>
      {!career && (
        <p>
          Please select a{" "}
          {!degree
            ? "degree"
            : !cohort
            ? "cohort"
            : !degreeType
            ? "degree type"
            : "career"}
        </p>
      )}
    </>
  );
}
