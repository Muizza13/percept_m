"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UploadZone } from "@/components/upload-zone";

export default function UploadPage() {
  const [slides, setSlides] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleUpload = useCallback(async (file: File) => {
    setLoading(true);
    setSlides([]);
    setError(null);
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
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <main className="font-body min-h-screen bg-[#0b1711] text-white">
      <section className="mx-auto max-w-4xl px-6 pb-10 pt-36 sm:pt-40">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[13px] text-white/70">
          <span className="h-1.5 w-1.5 rounded-full bg-[#c7f04b]" />
          Slide preprocessing
        </div>
        <h1 className="font-display text-[40px] font-bold leading-tight tracking-tight sm:text-[52px]">
          Upload your presentation
        </h1>
        <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/55">
          Drop a .ppt, .pptx or .pdf and we will convert each slide into an
          image, ready for brain analysis.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-10">
        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-2.5">
          <UploadZone onUpload={handleUpload} />
          <div className="mt-3 flex items-center justify-center gap-2.5 pb-2">
            {[".ppt", ".pptx", ".pdf"].map((fmt) => (
              <span
                key={fmt}
                className="rounded-md border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[12px] text-white/45"
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>
      </section>

      {error && (
        <section className="mx-auto max-w-4xl px-6 pb-6">
          <div className="rounded-2xl border border-red-400/25 bg-red-400/[0.06] px-5 py-4 text-[14px] text-red-300">
            {error}
          </div>
        </section>
      )}

      {loading && (
        <section className="mx-auto max-w-4xl px-6 pb-16">
          <p className="mb-6 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/40">
            Processing slides…
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-video animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.04]"
              />
            ))}
          </div>
        </section>
      )}

      {slides.length > 0 && !loading && (
        <section className="mx-auto max-w-4xl px-6 pb-28">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/40">
              {slides.length} slide{slides.length > 1 ? "s" : ""} extracted
            </p>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#c7f04b]/25 bg-[#c7f04b]/10 px-3 py-1 text-[12px] text-[#c7f04b]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c7f04b]" />
              Ready for analysis
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
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
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 py-2 opacity-0 transition group-hover:opacity-100">
                  <p className="text-[12px] text-white/70">Slide {i + 1}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="mb-4 text-[14px] text-white/45">
              Slides look good? Run the brain analysis.
            </p>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="inline-flex items-center gap-2 rounded-full bg-[#c7f04b] px-8 py-3.5 text-[14px] font-semibold text-[#10231a] transition hover:bg-[#d4f56b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {analyzing ? "Analyzing…" : "Analyze with Percept"}
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
