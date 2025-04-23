import express, { Request, Response } from "express";
import { courses } from "../values";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  const formattedData = Object.keys(courses);
  res.status(200).json({
    message: "Current courses data",
    data: formattedData,
  });
});

router.get(
  "/:courseId",
  (req: Request<{ courseId: string }>, res: Response) => {
    const courseId = req.params.courseId;
    const course = courses[courseId];

    if (!course) {
      res.status(404).json({
        message: `Course with ID '${courseId}' not found`,
        error: true,
      });
    }

    res.status(200).json({
      message: `Data for course ${courseId}`,
      data: course,
    });
  }
);

export default router;
