"use client";
import { useCallback } from "react";
import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";

export function UploadZone({ onUpload }: { onUpload: (file: File) => void }) {
  const onDrop = useCallback(
    (files: File[]) => {
      if (files[0]) onUpload(files[0]);
    },
    [onUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`group cursor-pointer rounded-xl border border-dashed p-14 text-center transition ${
        isDragActive
          ? "border-[#c7f04b]/50 bg-[#c7f04b]/[0.04]"
          : "border-white/12 bg-white/[0.015] hover:border-white/25 hover:bg-white/[0.025]"
      }`}
    >
      <input {...getInputProps()} />
      <span className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/55 transition group-hover:text-white/80">
        <Upload className="h-5 w-5" strokeWidth={1.8} />
      </span>
      <p className="text-[15px] font-medium tracking-tight text-white/90">
        {isDragActive ? "Drop it right here" : "Drag & drop your deck"}
      </p>
      <p className="mt-1 text-[13px] text-white/40">
        or{" "}
        <span className="text-white/70 underline underline-offset-2">
          browse files
        </span>{" "}
        — .ppt, .pptx or .pdf
      </p>
    </div>
  );
}
