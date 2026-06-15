"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FileCheck2, Loader2, Sparkles } from "lucide-react";
import { UploadZone } from "@/components/upload-zone";
import { FlowHeader } from "@/components/flow-header";

export default function UploadPage() {
  const [slides, setSlides] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleUpload = useCallback(async (file: File) => {
    setLoading(true);
    setSlides([]);
    setError(null);
    setFileName(file.name);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSlides(data.slides);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  async function handleAnalyze() {
    if (slides.length === 0) return;
    setAnalyzing(true);
    try {
      const results = await Promise.all(
        slides.map(async (slide) => {
          const res = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageBase64: slide }),
          });
          const data = await res.json();
          if (!res.ok || data.error) {
            throw new Error(data.error ?? "Analysis failed");
          }
          return data;
        }),
      );
      sessionStorage.setItem("perceptResults", JSON.stringify(results));
      sessionStorage.setItem("perceptSlides", JSON.stringify(slides));
      router.push("/analysis");
    } catch {
      setError("Analysis failed. Please try again.");
      setAnalyzing(false);
    }
  }

  const hasSlides = slides.length > 0 && !loading;

  return (
    <main className="font-body min-h-screen bg-[#0b1711] text-white">
      <FlowHeader current={hasSlides ? "review" : "upload"} />

      <section className="mx-auto max-w-3xl px-6 pb-40 pt-28 sm:pt-32">
        <div className="mb-8">
          <h1 className="font-display text-[28px] font-bold tracking-tight sm:text-[32px]">
            {hasSlides ? "Review your slides" : "Upload your presentation"}
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-white/50">
            {hasSlides
              ? "We converted each slide into an image. Looks right? Run the brain analysis."
              : "Drop a .ppt, .pptx or .pdf and we'll turn every slide into an image, ready for brain analysis."}
          </p>
        </div>

        {!hasSlides && (
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-2.5">
            <UploadZone onUpload={handleUpload} />
            <div className="flex items-center justify-between px-3 py-2.5">
              <div className="flex items-center gap-2">
                {[".ppt", ".pptx", ".pdf"].map((fmt) => (
                  <span
                    key={fmt}
                    className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[12px] text-white/45"
                  >
                    {fmt}
                  </span>
                ))}
              </div>
              <p className="text-[12px] text-white/30">Max 1 file</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-400/25 bg-red-400/[0.06] px-5 py-4 text-[14px] text-red-300">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-8">
            <div className="mb-6 flex items-center gap-2 text-[13px] text-white/50">
              <Loader2 className="h-4 w-4 animate-spin text-[#c7f04b]" />
              Converting{fileName ? ` ${fileName}` : " your deck"}…
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-video animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.04]"
                />
              ))}
            </div>
          </div>
        )}

        {hasSlides && (
          <div>
            <div className="mb-5 flex items-center gap-2.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <FileCheck2 className="h-4 w-4 shrink-0 text-[#c7f04b]" />
              <p className="truncate text-[13.5px] text-white/70">
                {fileName ?? "Presentation"}
              </p>
              <span className="ml-auto shrink-0 text-[12.5px] text-white/40">
                {slides.length} slide{slides.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {slides.map((src, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] transition hover:border-[#c7f04b]/40"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Slide ${i + 1}`}
                    className="w-full object-cover"
                  />
                  <span className="absolute left-2 top-2 rounded-md bg-black/50 px-2 py-0.5 text-[11px] text-white/70 backdrop-blur-sm">
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {hasSlides && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-[#0b1711]/85 backdrop-blur-xl">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
            <div className="min-w-0">
              <p className="text-[13.5px] font-medium text-white/80">
                {slides.length} slide{slides.length > 1 ? "s" : ""} ready
              </p>
              <p className="truncate text-[12px] text-white/35">
                Analysis scores attention, comprehension &amp; cognitive load.
              </p>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#c7f04b] px-7 py-3 text-[14px] font-semibold text-[#10231a] transition hover:bg-[#d4f56b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze with Percept
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
