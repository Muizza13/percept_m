"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadZone } from "@/components/upload-zone";

export default function UploadPage() {
  const [slides, setSlides] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleUpload(file: File) {
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
  }

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
          return res.json();
        }),
      );
      sessionStorage.setItem("perceptResults", JSON.stringify(results));
      router.push("/analysis");
    } catch {
      setError("Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <section className="max-w-4xl mx-auto px-8 pt-32 pb-10">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-xs text-blue-300 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
          Slide preprocessing
        </div>
        <h1 className="text-4xl font-semibold mb-3">
          Upload your presentation
        </h1>
        <p className="text-white/40 text-base">
          Drop a .ppt, .pptx or .pdf and we will convert each slide into an
          image for analysis.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-8 pb-10">
        <div className="rounded-2xl border border-dashed border-blue-500/30 bg-blue-500/[0.03] hover:bg-blue-500/[0.06] transition p-12 text-center">
          <UploadZone onUpload={handleUpload} />
          <div className="mt-4 flex items-center justify-center gap-3">
            {[".ppt", ".pptx", ".pdf"].map((fmt) => (
              <span
                key={fmt}
                className="bg-white/5 border border-white/10 rounded-md px-3 py-1 text-xs text-white/40"
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>
      </section>

      {error && (
        <section className="max-w-4xl mx-auto px-8 pb-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        </section>
      )}

      {loading && (
        <section className="max-w-4xl mx-auto px-8 pb-16">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-6">
            Processing slides...
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-video rounded-xl bg-white/[0.04] border border-white/[0.06] animate-pulse"
              />
            ))}
          </div>
        </section>
      )}

      {slides.length > 0 && !loading && (
        <section className="max-w-4xl mx-auto px-8 pb-24">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs text-white/30 uppercase tracking-widest">
              {slides.length} slide{slides.length > 1 ? "s" : ""} extracted
            </p>
            <span className="bg-teal-500/10 border border-teal-500/20 rounded-full px-3 py-1 text-xs text-teal-400">
              Ready for analysis
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {slides.map((src, i) => (
              <div
                key={i}
                className="group relative rounded-xl overflow-hidden border border-white/[0.07] bg-white/[0.03] hover:border-blue-500/40 transition"
              >
                <img
                  src={src}
                  alt={`Slide ${i + 1}`}
                  className="w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 opacity-0 group-hover:opacity-100 transition">
                  <p className="text-xs text-white/60">Slide {i + 1}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-white/30 text-sm mb-4">
              Slides look good? Run the brain analysis.
            </p>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition text-white px-8 py-3 rounded-xl text-sm font-medium"
            >
              {analyzing ? "Analyzing..." : "Analyze with Percept"}
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
