export interface Message {
  type: "question" | "answer";
  text: string;
}

export interface FileEntry {
  fileHash: string;
  fileName: string;
  destination: string;
  size: number;
  mimetype: string;
  createdAt: string;
}

export interface CourseProject {
  files: FileEntry[];
  messages: Message[];
  courseName: string;
}

export type Courses = {
  [courseName: string]: CourseProject;
};
