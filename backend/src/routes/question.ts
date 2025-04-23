import express, { Request, Response } from "express";
import axios from "axios";
import { courses } from "../values";

const router = express.Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const question = req.query.question as string;
    const courseId = req.query.courseId as string;

    if (!question || !courseId) {
      res.status(400).send("Missing question or courseId");
      return;
    }

    const course = courses[courseId];
    if (!course) {
      res.status(404).send("Course not found");
      return;
    }

    course.messages.push({ type: "question", text: question });

    course.messages.push({ type: "answer", text: "" });
    const answerIndex = course.messages.length - 1;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
    console.log(process.env.RAG_URL);
    const response = await axios.post(
      `${process.env.RAG_URL}/query/`,
      new URLSearchParams({ question, course_id: courseId }),
      { responseType: "stream" }
    );
    response.data.on("data", (chunk: Buffer) => {
      const textChunk = chunk.toString();

      res.write(`${textChunk}\n\n`);

      const currentAnswer = course.messages[answerIndex];
      if (currentAnswer?.type === "answer") {
        currentAnswer.text += textChunk.replace(/data: |\s*\[DONE\]\s*/g, "");
      }
    });

    response.data.on("end", () => {
      res.write("[DONE]\n\n");
      res.end();
    });

    req.on("close", () => {
      response.data.destroy();
    });
  } catch (err) {
    console.error("Streaming error:", err);
    res.status(500).write("Error occurred\n\n");
    res.end();
  }
});

export default router;
