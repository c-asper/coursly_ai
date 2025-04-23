import axios from "axios";
import fs from "fs";
import FormData from "form-data";

export const sendDocumentToRAG = async (
  filePath: string,
  filename: string,
  doc_id: string,
  user_id: string,
  course_id: string
) => {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath), filename);
  form.append("doc_id", doc_id);
  form.append("user_id", user_id);
  form.append("course_id", course_id);
  console.log(process.env.RAG_URL);
  const response = await axios.post(`${process.env.RAG_URL}/upload/`, form, {
    headers: form.getHeaders(),
  });

  return response.data;
};

export const askQuestionToRAG = async (question: string) => {
  const response = await axios.post(`${process.env.RAG_URL}/ask`, { question });
  return response.data;
};
