import { useEffect, useState } from "react";

const KEY = "completed-courses";

const removeDuplicates = (arr: string[]) => [...new Set(arr)];

export const getCompletedCourses = (): string[] => {
  const value = window.localStorage.getItem(KEY);
  return value ? JSON.parse(value) : [];
};

export const useCompletedCourses = () => {
  const [completedCourses, setCompletedCourses] = useState<string[]>(() => {
    const value = window.localStorage.getItem(KEY);
    return value ? JSON.parse(value) : [];
  });

  useEffect(() => {
    const uniqueCourses = removeDuplicates(completedCourses);
    localStorage.setItem(KEY, JSON.stringify(uniqueCourses));
  }, [completedCourses]);

  const addCompletedCourse = (courseCode: string) => {
    setCompletedCourses((completedCourses) => [
      ...completedCourses,
      courseCode,
    ]);
  };

  const importCompletedCourses = (courseCodes: string[]) => {
    setCompletedCourses(courseCodes);
  };

  const resetCompletedCourse = () => {
    setCompletedCourses([]);
  };

  const removeCompletedCourse = (courseCode: string) => {
    setCompletedCourses((completedCourses) =>
      completedCourses.filter((val) => val !== courseCode)
    );
  };

  return {
    completedCourses,
    addCompletedCourse,
    resetCompletedCourse,
    removeCompletedCourse,
    importCompletedCourses,
  };
};
