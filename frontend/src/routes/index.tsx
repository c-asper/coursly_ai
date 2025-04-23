import { createFileRoute, useRouter } from "@tanstack/react-router";
import axios from "axios";
import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import SubmitButton from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const router = useRouter();
  const [files, setFiles] = useState<Array<File>>([]);
  const [courseName, setCourseName] = useState<string>("");
  const [progress, setProgress] = useState<null | number>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (files: Array<File>) => {
    setFiles(files);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (files.length === 0) {
      setError("Please select a file to upload.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("courseName", courseName);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/document`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (event) => {
            const progress = Math.round(
              (event.loaded * 100) / (event.total || 0),
            );
            setProgress(progress);
          },
        },
      );

      console.log("File uploaded successfully:", response.data);

      await router.navigate({ to: `/${courseName}` });
      await router.invalidate();
    } catch (err) {
      setError("Failed to upload file. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex h-full w-full max-w-2xl flex-col items-center justify-center"
    >
      <div className={"mt-8 flex w-full flex-col gap-2"}>
        <Label htmlFor="course-name">Course name</Label>
        <Input
          id="course-name"
          placeholder="My fun course"
          type="text"
          onChange={(e) => {
            setCourseName(e.target.value);
          }}
        />
      </div>

      <div className="mt-8 min-h-96 w-full rounded-lg border border-dashed border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
        <FileUpload onChange={handleFileUpload} />
      </div>

      {error && (
        <p className="textms- text-semibold text-red-500">
          There was an error, please try again.{" "}
        </p>
      )}

      <SubmitButton
        disabled={files.length == 0 || courseName.length == 0}
        text="Create"
        textLoading={`Uploading ${progress} %`}
        className="mt-8 w-full"
        loading={loading}
      />
    </form>
  );
}
