import express from "express";
import cors from "cors";
import documentRouter from "./routes/document";
import coursesRouter from "./routes/courses";
import questionRouter from "./routes/question";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(cors());
app.use(express.json());
app.use("/api/document", documentRouter);
app.use("/api/question", questionRouter);
app.use("/api/courses", coursesRouter);

export default app;
