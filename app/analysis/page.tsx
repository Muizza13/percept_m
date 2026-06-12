"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  type SlideResult,
  generateInsight,
  generateRecommendations,
} from "@/lib/insights";

function loadStyles(load: SlideResult["cognitiveLoad"]) {
  if (load === "Low") {
    return "text-[#c7f04b] bg-[#c7f04b]/10 border-[#c7f04b]/25";
  }
  if (load === "Medium") {
    return "text-amber-300 bg-amber-400/10 border-amber-400/25";
  }
  return "text-red-300 bg-red-400/10 border-red-400/25";
}

function isSlideResult(value: unknown): value is SlideResult {
  if (!value || typeof value !== "object") return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r.attention === "number" &&
    typeof r.comprehension === "number" &&
    (r.cognitiveLoad === "Low" ||
      r.cognitiveLoad === "Medium" ||
      r.cognitiveLoad === "High")
  );
}

export default function AnalysisPage() {
  const [results, setResults] = useState<SlideResult[]>([]);
  const [slides, setSlides] = useState<string[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("perceptResults");
    const storedSlides = sessionStorage.getItem("perceptSlides");

    let nextResults: SlideResult[] = [];
    let nextSlides: string[] = [];

    if (stored) {
      try {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          nextResults = parsed.filter(isSlideResult);
        }
      } catch {
        // ignore invalid session data
      }
    }
    if (storedSlides) {
      try {
        const parsed: unknown = JSON.parse(storedSlides);
        if (Array.isArray(parsed)) {
          nextSlides = parsed.filter((s): s is string => typeof s === "string");
        }
      } catch {
        // ignore invalid session data
      }
    }

    // sessionStorage is only readable after client mount
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from sessionStorage once on mount
    setResults(nextResults);
    setSlides(nextSlides);
  }, []);

  const slideInsights = useMemo(
    () =>
      results.map((r) => ({
        insight: generateInsight(r),
        recommendations: generateRecommendations(r),
      })),
    [results],
  );

  const avg = (key: "attention" | "comprehension") =>
    results.length > 0
      ? Math.round(
          results.reduce((sum, r) => sum + r[key], 0) / results.length,
        )
      : 0;

  return (
    <main className="font-body min-h-screen bg-[#0b1711] text-white">
      <section className="mx-auto max-w-5xl px-6 pb-10 pt-36 sm:pt-40">
        <div className="mb-6 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[13px] text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c7f04b]" />
            Analysis results
          </div>
          <Link
            href="/upload"
            className="rounded-full border border-white/12 px-4 py-2 text-[13px] text-white/60 transition hover:border-white/30 hover:text-white"
          >
            Upload new file
          </Link>
        </div>
        <h1 className="font-display text-[40px] font-bold leading-tight tracking-tight sm:text-[52px]">
          Brain analysis
        </h1>
        <p className="mt-4 text-[16px] text-white/55">
          {results.length} slide{results.length !== 1 ? "s" : ""} analyzed.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Avg attention",
              value: `${avg("attention")}`,
              suffix: "/100",
              sub: `Across ${results.length} slides`,
            },
            {
              label: "Avg comprehension",
              value: `${avg("comprehension")}`,
              suffix: "/100",
              sub: `Across ${results.length} slides`,
            },
            {
              label: "Slides analyzed",
              value: `${results.length}`,
              suffix: "",
              sub: "From your upload",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6"
            >
              <p className="text-[12.5px] text-white/45">{s.label}</p>
              <p className="font-display mt-2 text-[40px] font-bold tracking-tight text-[#c7f04b]">
                {s.value}
                {s.suffix && (
                  <span className="text-[16px] text-white/25">{s.suffix}</span>
                )}
              </p>
              <p className="mt-1 text-[12px] text-white/35">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl space-y-6 px-6 pb-32">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/40">
          Per slide breakdown
        </p>
        {results.map((r, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02]"
          >
            <div className="grid md:grid-cols-2">
              <div className="flex min-h-[240px] items-center justify-center border-b border-white/[0.07] bg-black/25 md:border-b-0 md:border-r">
                {slides[i] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={slides[i]}
                    alt={`Slide ${i + 1}`}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center">
                    <p className="text-[12px] text-white/20">No preview</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-5 p-7">
                <div className="flex items-center justify-between">
                  <p className="font-display text-[15px] font-semibold tracking-tight text-white/80">
                    Slide {i + 1}
                  </p>
                  <span
                    className={`rounded-full border px-3 py-1 text-[12px] ${loadStyles(r.cognitiveLoad)}`}
                  >
                    {r.cognitiveLoad} cognitive load
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Attention", value: r.attention },
                    { label: "Comprehension", value: r.comprehension },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-4 py-3"
                    >
                      <div className="flex items-baseline justify-between">
                        <p className="text-[12.5px] text-white/45">
                          {m.label}
                        </p>
                        <p className="font-display text-[20px] font-semibold text-white">
                          {m.value}
                          <span className="text-[13px] text-white/25">
                            /100
                          </span>
                        </p>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-[#c7f04b] transition-all duration-700"
                          style={{ width: `${m.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c7f04b]/80">
                    Why these scores
                  </p>
                  <p className="text-[12.5px] leading-relaxed text-white/55">
                    {slideInsights[i]?.insight}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/[0.07] px-7 py-5">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
                Recommendations
              </p>
              <div className="grid grid-cols-1 gap-3">
                {slideInsights[i]?.recommendations.map((rec, j) => (
                  <div
                    key={j}
                    className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#c7f04b]/30 bg-[#c7f04b]/15 text-[11px] font-semibold text-[#c7f04b]">
                      {j + 1}
                    </span>
                    <p className="text-[12.5px] leading-relaxed text-white/55">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
