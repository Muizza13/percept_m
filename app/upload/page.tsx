"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FileCheck2, Loader2, Sparkles } from "lucide-react";
import { UploadZone } from "@/components/upload-zone";
import { FlowHeader } from "@/components/flow-header";
import type { SlideResult } from "@/lib/insights";
import type { SlideReference } from "@/lib/slides";

const ANALYSIS_CONCURRENCY = 3;
const MAX_ANALYSIS_RETRIES = 2;
const TRANSIENT_STATUS_CODES = new Set([429, 500, 502, 503]);

type ConvertResponse = {
  deckId?: string;
  slides?: SlideReference[];
  error?: string;
};

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function analyzeSlide(
  deckId: string,
  slide: SlideReference,
): Promise<SlideResult> {
  for (let attempt = 0; attempt <= MAX_ANALYSIS_RETRIES; attempt += 1) {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deckId, slideIndex: slide.index }),
    });
    const data = await res.json();

    if (res.ok && !data.error) {
      return data;
    }

    const canRetry =
      TRANSIENT_STATUS_CODES.has(res.status) && attempt < MAX_ANALYSIS_RETRIES;
    if (!canRetry) {
      throw new Error(
        `Slide ${slide.index + 1}: ${data.error ?? "Analysis failed"}`,
      );
    }

    await delay(600 * 2 ** attempt);
  }

  throw new Error(`Slide ${slide.index + 1}: Analysis failed`);
}

async function analyzeSlides(deckId: string, slides: SlideReference[]) {
  const results = new Array<SlideResult>(slides.length);
  let nextSlide = 0;
  let firstError: Error | null = null;

  async function worker() {
    while (!firstError) {
      const current = nextSlide;
      nextSlide += 1;

      if (current >= slides.length) {
        return;
      }

      try {
        results[current] = await analyzeSlide(deckId, slides[current]);
      } catch (error) {
        firstError = error instanceof Error ? error : new Error("Analysis failed");
        return;
      }
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(ANALYSIS_CONCURRENCY, slides.length) },
      () => worker(),
    ),
  );

  if (firstError) {
    throw firstError;
  }

  return results;
}

export default function UploadPage() {
  const [deckId, setDeckId] = useState<string | null>(null);
  const [slides, setSlides] = useState<SlideReference[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleUpload = useCallback(async (file: File) => {
    setLoading(true);
    setDeckId(null);
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
      const data = (await res.json()) as ConvertResponse;
      if (!res.ok || data.error) {
        setError(data.error ?? "Conversion failed");
      } else if (!data.deckId || !Array.isArray(data.slides)) {
        setError("Conversion returned an invalid response.");
      } else {
        setDeckId(data.deckId);
        setSlides(data.slides);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  async function handleAnalyze() {
    if (!deckId || slides.length === 0) return;
    setAnalyzing(true);
    setError(null);
    try {
      const results = await analyzeSlides(deckId, slides);
      sessionStorage.setItem("perceptResults", JSON.stringify(results));
      sessionStorage.setItem("perceptSlides", JSON.stringify(slides));
      sessionStorage.setItem("perceptDeckId", deckId);
      router.push("/analysis");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Analysis failed. Please try again.";
      setError(`${message}. Please try again.`);
      setAnalyzing(false);
    }
  }

  const hasSlides = slides.length > 0 && !loading;

  return (
    <main className="font-body min-h-screen bg-[#0a0a0a] text-white">
      <FlowHeader current={hasSlides ? "review" : "upload"} />

      <section className="mx-auto max-w-3xl px-6 pb-40 pt-24 sm:pt-28">
        <div className="mb-8">
          <h1 className="font-display text-[26px] font-semibold tracking-tight sm:text-[30px]">
            {hasSlides ? "Review your slides" : "Upload your presentation"}
          </h1>
          <p className="mt-2 text-[14.5px] leading-relaxed text-white/45">
            {hasSlides
              ? "Each slide was converted to an image. If everything looks right, run the analysis."
              : "Add a .ppt, .pptx or .pdf. We convert every slide into an image for analysis."}
          </p>
        </div>

        {!hasSlides && <UploadZone onUpload={handleUpload} />}

        {error && (
          <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/[0.05] px-4 py-3 text-[13.5px] text-red-300">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-8">
            <div className="mb-6 flex items-center gap-2 text-[13px] text-white/45">
              <Loader2 className="h-4 w-4 animate-spin text-[#c7f04b]" />
              Converting{fileName ? ` ${fileName}` : " your deck"}…
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-video animate-pulse rounded-lg border border-white/[0.06] bg-white/[0.03]"
                />
              ))}
            </div>
          </div>
        )}

        {hasSlides && (
          <div>
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-2.5">
              <FileCheck2 className="h-4 w-4 shrink-0 text-[#c7f04b]" />
              <p className="truncate text-[13px] text-white/70">
                {fileName ?? "Presentation"}
              </p>
              <span className="ml-auto shrink-0 text-[12.5px] text-white/35">
                {slides.length} slide{slides.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {slides.map((slide, i) => (
                <div
                  key={slide.index}
                  className="group relative overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.02] transition hover:border-white/20"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.imageUrl}
                    alt={`Slide ${i + 1}`}
                    className="w-full object-cover"
                  />
                  <span className="absolute left-2 top-2 rounded bg-black/55 px-1.5 py-0.5 text-[10px] text-white/70 backdrop-blur-sm">
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {hasSlides && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.07] bg-[#0a0a0a]/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-3.5">
            <p className="text-[13px] text-white/45">
              {slides.length} slide{slides.length > 1 ? "s" : ""} ready
            </p>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#c7f04b] px-6 py-2.5 text-[13.5px] font-semibold text-[#0a0a0a] transition hover:bg-[#d4f56b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
