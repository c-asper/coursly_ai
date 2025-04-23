type Message = {
  type: "question" | "answer";
  text: string;
  words?: string[];
};

export const fetchCourse = async (
  courseId: string,
): Promise<{
  message: string;
  data: {
    messages: Message[];
    courseName: string;
    files: Array<{
      destination: string;
      fileHash: string;
      fileName: string;
      mimetype: string;
      size: number;
      createdAt: string;
    }>;
  };
}> => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/courses/${courseId}`,
  );
  if (!res.ok) {
    throw new Error("Failed to fetch course");
  }
  return res.json();
};
