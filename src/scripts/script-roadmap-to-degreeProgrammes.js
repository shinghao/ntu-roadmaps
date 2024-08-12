import RoadmapData from "../data/roadmapdata.json" assert { type: "json" };

function roadmapToDegreeProgrammesJson() {
  const SCHOOL = "School of Computer Science and Engineering";

  const result = {};

  for (const { degree, type, cohort } of RoadmapData) {
    if (result?.[degree] === undefined) {
      result[degree] = { school: SCHOOL, degree, cohorts: {} };
    }
    result[degree].cohorts = {
      ...result[degree].cohorts,
      [cohort]: [...(result[degree]?.cohorts?.[cohort] ?? []), type],
    };
  }

  return JSON.stringify(Object.values(result));
}

console.log(roadmapToDegreeProgrammesJson());
