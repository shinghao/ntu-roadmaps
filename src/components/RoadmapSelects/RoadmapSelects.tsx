import useFetchCareers from "@hooks/useFetchCareers";
import useFetchDegreeProgrammes from "@hooks/useFetchDegreeProgrammes";
import {
  Stack,
  Autocomplete,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import useRoadmapSelectsStore from "@store/useRoadmapSelectsStore";
import { useCallback, useMemo } from "react";

export default function RoadmapSelects({
  setAvailableElectives,
}: {
  setAvailableElectives: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
      const selectedCareerElectives = fetchedCareers?.find(
        ({ career }) => career === value
      )?.electives;
      setAvailableElectives(selectedCareerElectives ?? []);
    },
    [fetchedCareers, setAvailableElectives, setCareer]
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
      <Stack spacing={3} direction="row" flexWrap="wrap" useFlexGap>
        {selectsConfig
          .filter((config) => !config.options || config.options.length > 0) // Filter out configs that have previous requirements
          .map((config) => (
            <Autocomplete
              freeSolo
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
              size={isMobile ? "small" : "medium"}
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
