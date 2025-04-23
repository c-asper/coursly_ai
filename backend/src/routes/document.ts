import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import { sendDocumentToRAG } from "../services/ragService";
import { courses } from "../values";
import XXH from "xxhash-wasm";
import fs from "fs/promises";

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, "../../uploads/") });

router.post(
  "/",
  upload.array("files"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[];
      const courseName = req.body.courseName;
      if (!files || files.length === 0) {
        res.status(400).json({ error: "No files uploaded" });
        return;
      }

      // We would use this hash to deduplicate files
      const xxh = await XXH();

      await Promise.all(
        files.map(async (file: Express.Multer.File) => {
          const buffer = await fs.readFile(file.path);
          const fileHash = xxh.h64Raw(new Uint8Array(buffer), 0n).toString(16);
          courses[courseName] ??= {
            files: [],
            messages: [],
            courseName: courseName,
          };

          courses[courseName].files.push({
            fileHash,
            fileName: file.originalname,
            destination: file.destination,
            size: file.size,
            mimetype: file.mimetype,
            createdAt: new Date().toISOString(),
          });
          
          // For larger lfiles it would be prudent to give the user status updates via WS or SSE
          // but if the files are less than 50 pages this shouldnt be a problem
          await sendDocumentToRAG(
            file.path,
            file.originalname,
            fileHash,
            "userId",
            courseName 
          );
        })
      );

      res
        .status(200)
        .json({ message: "All files uploaded and processed", data: courses });
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Failed to process files" });
    }
  }
);

export default router;
