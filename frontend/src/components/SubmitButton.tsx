"use client";

import { useFormStatus } from "react-dom";
import LoadingSpinner from "./LoadingSpinner";
import { cn } from "@/lib/utils";

export default function SubmitButton({
  text,
  textLoading,
  disabled,
  className,
  loading = false,
}: {
  text: string;
  textLoading: string;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <>
      <button
        aria-disabled={loading || pending || disabled}
        disabled={loading || pending || disabled}
        className={cn(
          "bg-main cursor-pointer rounded-md px-3 py-1.5 text-sm text-white disabled:cursor-not-allowed disabled:bg-zinc-400",
          className,
        )}
      >
        {loading || pending ? (
          <p className="flex items-center justify-center gap-2">
            <LoadingSpinner />
            {textLoading}
          </p>
        ) : (
          text
        )}
      </button>
    </>
  );
}
