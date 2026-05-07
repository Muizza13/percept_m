"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function AnalysisResults() {
  const searchParams = useSearchParams();
  const raw = searchParams.get("results");

  const results = raw ? JSON.parse(decodeURIComponent(raw)) : [];

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <section className="max-w-5xl mx-auto px-8 pt-32 pb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-xs text-violet-300">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
            Analysis results
          </div>
          <Link
            href="/upload"
            className="text-xs text-white/40 hover:text-white/70 transition border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl"
          >
            Upload new file
          </Link>
        </div>
        <h1 className="text-4xl font-semibold mb-3">Brain analysis</h1>
        <p className="text-white/40 text-base">
          {results.length} slide{results.length !== 1 ? "s" : ""} analyzed.
        </p>
      </section>

      {/* Overall summary */}
      <section className="max-w-5xl mx-auto px-8 pb-10">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
            <p className="text-xs text-white/40 mb-2">Avg attention</p>
            <p className="text-4xl font-medium text-blue-400">
              {results.length > 0
                ? Math.round(
                    results.reduce((a: number, r: any) => a + r.attention, 0) /
                      results.length,
                  )
                : 0}
              <span className="text-lg text-white/25">/100</span>
            </p>
            <p className="text-xs text-white/25 mt-1">
              Across {results.length} slides
            </p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
            <p className="text-xs text-white/40 mb-2">Avg comprehension</p>
            <p className="text-4xl font-medium text-violet-400">
              {results.length > 0
                ? Math.round(
                    results.reduce(
                      (a: number, r: any) => a + r.comprehension,
                      0,
                    ) / results.length,
                  )
                : 0}
              <span className="text-lg text-white/25">/100</span>
            </p>
            <p className="text-xs text-white/25 mt-1">
              Across {results.length} slides
            </p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
            <p className="text-xs text-white/40 mb-2">Slides analyzed</p>
            <p className="text-4xl font-medium text-teal-400">
              {results.length}
            </p>
            <p className="text-xs text-white/25 mt-1">From your upload</p>
          </div>
        </div>
      </section>

      {/* Per slide */}
      <section className="max-w-5xl mx-auto px-8 pb-32 space-y-6">
        <p className="text-xs text-white/30 uppercase tracking-widest">
          Per slide breakdown
        </p>
        {results.map((r: any, i: number) => (
          <div
            key={i}
            className="border border-white/[0.07] bg-white/[0.02] rounded-2xl p-7"
          >
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-medium text-white/70">Slide {i + 1}</p>
              <span
                className={`text-xs px-3 py-1 rounded-full border ${
                  r.cognitiveLoad === "Low"
                    ? "text-teal-400 bg-teal-500/10 border-teal-500/20"
                    : r.cognitiveLoad === "Medium"
                      ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                      : "text-red-400 bg-red-500/10 border-red-500/20"
                }`}
              >
                {r.cognitiveLoad} cognitive load
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3">
                <p className="text-xs text-white/40 mb-1">Attention</p>
                <p className="text-2xl font-medium text-blue-400">
                  {r.attention}
                  <span className="text-sm text-white/25">/100</span>
                </p>
              </div>
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-3">
                <p className="text-xs text-white/40 mb-1">Comprehension</p>
                <p className="text-2xl font-medium text-violet-400">
                  {r.comprehension}
                  <span className="text-sm text-white/25">/100</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020817]" />}>
      <AnalysisResults />
    </Suspense>
  );
}
