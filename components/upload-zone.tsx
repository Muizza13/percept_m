"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";

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
      className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer hover:bg-muted transition"
    >
      <input {...getInputProps()} />
      <p className="text-muted-foreground mb-4">
        {isDragActive
          ? "Drop it here..."
          : "Drag a .ppt, .pptx or .pdf file, or click to browse"}
      </p>
      <Button type="button">Upload Presentation</Button>
    </div>
  );
}
