import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { useState } from "react";
import { fetchCourse } from "@/queries/getCourse";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholder-and-vanish-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/$courseId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const response = await fetchCourse(params.courseId);
    return { course: response.data };
  },
});

function RouteComponent() {
  const { courseId } = Route.useParams();
  const { course } = useLoaderData({ from: "/$courseId" });
  const [conversation, setConversation] = useState<
    {
      type: "question" | "answer";
      text: string;
    }[]
  >(course.messages);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>, value: string) => {
    e.preventDefault();

    setIsStreaming(true);

    setConversation((prev) => [
      ...prev,
      { type: "question", text: value },
      { type: "answer", text: "" },
    ]);

    const url = `${import.meta.env.VITE_BACKEND_URL}/api/question?question=${encodeURIComponent(value)}&courseId=${encodeURIComponent(courseId)}`;
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      if (event.data === "[DONE]") {
        eventSource.close();
        setIsStreaming(false);
      } else {
        setConversation((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;

          if (updated[lastIndex]?.type === "answer") {
            updated[lastIndex] = {
              ...updated[lastIndex],
              text: updated[lastIndex].text + event.data,
            };
          }

          return updated;
        });
      }
    };

    eventSource.onerror = (err) => {
      console.error("Streaming error:", err);
      eventSource.close();
      setIsStreaming(false);
    };
  };
  console.log(course.files);
  return (
    <>
      <div className="mx-auto mb-8 flex h-full w-full max-w-5xl flex-col overflow-auto">
        <h2>Ask a Question</h2>
        <div className="flex h-full flex-col overflow-auto">
          <p>
            {conversation.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`flex ${item.type == "question" ? "justify-end" : "justify-start"} my-4`}
                >
                  <p className="max-w-1600 rounded-xl bg-zinc-200 p-2 px-3 py-1.5">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </p>
        </div>
        <PlaceholdersAndVanishInput
          onChange={handleChange}
          onSubmit={onSubmit}
          disabled={isStreaming}
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="absolute right-4 bottom-4 flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-400 bg-zinc-100 p-1 pl-3">
            <p className="text-sm font-medium">Uploaded files</p>
            <div className="flex items-center justify-center px-2 text-lg">
              {course.files.length}
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="text-sm text-zinc-200">
            All uploaded files
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {course.files.map((file) => {
            const formatted = new Date(file.createdAt).toLocaleDateString(
              "de-DE",
              {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              },
            );
            return (
              <>
                <DropdownMenuItem>
                  <p className="max-w-30 truncate">{file.fileName}</p>
                  <p>{formatted}</p>
                </DropdownMenuItem>
              </>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
