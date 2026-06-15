"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Upload } from "lucide-react";
import {
  type SlideResult,
  parseSlideResult,
  resolveSlideContent,
} from "@/lib/insights";
import { FlowHeader } from "@/components/flow-header";

function loadStyles(load: SlideResult["cognitiveLoad"]) {
  if (load === "Low") {
    return "text-[#c7f04b] bg-[#c7f04b]/10 border-[#c7f04b]/25";
  }
  if (load === "Medium") {
    return "text-amber-300 bg-amber-400/10 border-amber-400/25";
  }
  return "text-red-300 bg-red-400/10 border-red-400/25";
}

function loadDot(load: SlideResult["cognitiveLoad"]) {
  if (load === "Low") return "bg-[#c7f04b]";
  if (load === "Medium") return "bg-amber-300";
  return "bg-red-400";
}

export default function AnalysisPage() {
  const [results, setResults] = useState<SlideResult[]>([]);
  const [slides, setSlides] = useState<string[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem("perceptResults");
    const storedSlides = sessionStorage.getItem("perceptSlides");

    let nextResults: SlideResult[] = [];
    let nextSlides: string[] = [];

    if (stored) {
      try {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          nextResults = parsed
            .map(parseSlideResult)
            .filter((r): r is SlideResult => r !== null);
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

  const total = results.length;

  const go = useCallback(
    (dir: -1 | 1) => {
      setActive((i) => Math.min(Math.max(i + dir, 0), Math.max(total - 1, 0)));
    },
    [total],
  );

  useEffect(() => {
    if (total === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, total]);

  const avg = (key: "attention" | "comprehension") =>
    total > 0
      ? Math.round(results.reduce((sum, r) => sum + r[key], 0) / total)
      : 0;

  if (total === 0) {
    return (
      <main className="font-body min-h-screen bg-[#0a0a0a] text-white">
        <FlowHeader current="analyze" />
        <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
          <h1 className="font-display text-[24px] font-semibold tracking-tight">
            No analysis yet
          </h1>
          <p className="mt-2 text-[14px] text-white/45">
            Upload a presentation to see how each slide lands in the brain.
          </p>
          <Link
            href="/upload"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#c7f04b] px-6 py-2.5 text-[13.5px] font-semibold text-[#0a0a0a] transition hover:bg-[#d4f56b]"
          >
            <Upload className="h-4 w-4" />
            Upload a deck
          </Link>
        </div>
      </main>
    );
  }

  const current = results[active];
  const { insight, recommendations } = resolveSlideContent(current);

  return (
    <main className="font-body flex min-h-[100dvh] flex-col bg-[#0a0a0a] pt-[57px] text-white lg:h-[100dvh] lg:overflow-hidden">
      <FlowHeader current="analyze" />

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-6 py-3">
        <div className="flex items-baseline gap-2.5">
          <h1 className="font-display text-[17px] font-semibold tracking-tight">
            Brain analysis
          </h1>
          <span className="text-[12.5px] text-white/35">
            {total} slide{total !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-5">
          {[
            { label: "Avg attention", value: avg("attention") },
            { label: "Avg comprehension", value: avg("comprehension") },
          ].map((s) => (
            <div key={s.label} className="flex items-baseline gap-1.5">
              <span className="text-[12px] text-white/40">{s.label}</span>
              <span className="font-display text-[15px] font-semibold text-white">
                {s.value}
                <span className="text-[11px] text-white/25">/100</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-3 px-6 pb-5 lg:min-h-0 lg:grid-cols-[84px_1fr_352px]">
        <aside className="order-3 min-h-0 lg:order-1">
          <div className="flex gap-2 overflow-x-auto pb-1 lg:h-full lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto lg:pb-0 lg:pr-1">
            {results.map((r, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === active}
                className={`group relative aspect-video w-24 shrink-0 overflow-hidden rounded-md border bg-white/[0.02] transition lg:w-full ${
                  i === active
                    ? "border-[#c7f04b]/70"
                    : "border-white/[0.07] hover:border-white/20"
                }`}
              >
                {slides[i] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={slides[i]}
                    alt={`Slide ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-[11px] text-white/20">
                    {i + 1}
                  </span>
                )}
                <span className="absolute left-1 top-1 rounded bg-black/55 px-1 py-0.5 text-[9px] text-white/70 backdrop-blur-sm">
                  {i + 1}
                </span>
                <span
                  className={`absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full ${loadDot(r.cognitiveLoad)}`}
                />
              </button>
            ))}
          </div>
        </aside>

        <div className="relative order-1 flex min-h-[42vh] items-center justify-center overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.015] p-4 lg:order-2 lg:min-h-0">
          {slides[active] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={slides[active]}
              alt={`Slide ${active + 1}`}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <p className="text-[12px] text-white/20">No preview</p>
          )}

          <span className="absolute left-3 top-3 rounded-md bg-black/50 px-2.5 py-1 text-[11.5px] font-medium text-white/75 backdrop-blur-sm">
            {active + 1} / {total}
          </span>

          <button
            onClick={() => go(-1)}
            disabled={active === 0}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#18181b] text-white transition hover:border-white/35 hover:bg-[#27272a] disabled:pointer-events-none disabled:opacity-25"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => go(1)}
            disabled={active === total - 1}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#c7f04b] text-[#0a0a0a] transition hover:bg-[#d4f56b] disabled:pointer-events-none disabled:opacity-25"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="order-2 flex min-h-0 flex-col gap-3 overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.015] p-5 lg:order-3">
          <div className="flex shrink-0 items-center justify-between">
            <p className="font-display text-[14px] font-semibold tracking-tight text-white/85">
              Slide {active + 1}
            </p>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[11.5px] ${loadStyles(current.cognitiveLoad)}`}
            >
              {current.cognitiveLoad} load
            </span>
          </div>

          <div className="grid shrink-0 grid-cols-2 gap-2.5">
            {[
              { label: "Attention", value: current.attention },
              { label: "Comprehension", value: current.comprehension },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5"
              >
                <p className="text-[11.5px] text-white/40">{m.label}</p>
                <p className="font-display mt-0.5 text-[21px] font-semibold text-white">
                  {m.value}
                  <span className="text-[11px] text-white/25">/100</span>
                </p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[#c7f04b] transition-all duration-700"
                    style={{ width: `${m.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="shrink-0">
            <p className="mb-1.5 text-[10.5px] font-medium uppercase tracking-[0.14em] text-white/35">
              Why these scores
            </p>
            <p className="line-clamp-3 text-[12px] leading-relaxed text-white/50">
              {insight}
            </p>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            <p className="mb-2 shrink-0 text-[10.5px] font-medium uppercase tracking-[0.14em] text-white/35">
              Recommendations
            </p>
            <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
              {recommendations.map((rec, j) => (
                <div key={j} className="flex items-start gap-2.5">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#c7f04b]" />
                  <p className="text-[12px] leading-snug text-white/50">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-white/[0.07] pt-3">
            <button
              onClick={() => go(-1)}
              disabled={active === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 px-4 py-2 text-[13px] font-medium text-white/75 transition hover:border-white/30 hover:text-white disabled:pointer-events-none disabled:opacity-25"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>
            <span className="text-[12.5px] tabular-nums text-white/40">
              {active + 1} / {total}
            </span>
            <button
              onClick={() => go(1)}
              disabled={active === total - 1}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#c7f04b] px-5 py-2 text-[13px] font-semibold text-[#0a0a0a] transition hover:bg-[#d4f56b] disabled:pointer-events-none disabled:opacity-25"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
