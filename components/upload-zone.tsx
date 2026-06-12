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
      className={`group cursor-pointer rounded-[20px] border border-dashed p-12 text-center transition ${
        isDragActive
          ? "border-[#c7f04b]/60 bg-[#c7f04b]/[0.06]"
          : "border-white/15 bg-white/[0.01] hover:border-[#c7f04b]/40 hover:bg-white/[0.03]"
      }`}
    >
      <input {...getInputProps()} />
      <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c7f04b] text-[#10231a]">
        <Upload className="h-[22px] w-[22px]" strokeWidth={1.8} />
      </span>
      <p className="font-display text-[17px] font-semibold tracking-tight text-white">
        {isDragActive ? "Drop it right here" : "Drag & drop your deck"}
      </p>
      <p className="mt-1.5 text-[13.5px] text-white/45">
        or{" "}
        <span className="text-[#c7f04b] underline-offset-2 group-hover:underline">
          browse files
        </span>{" "}
        — .ppt, .pptx or .pdf
      </p>
    </div>
  );
}
