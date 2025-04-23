export const fetchCourses = async (): Promise<{
  message: string;
  data: Array<string>;
}> => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/courses`);
  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }
  return res.json();
};
