"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Upload } from "lucide-react";
import {
  type SlideResult,
  type SlideBlock,
  parseSlideResult,
  resolveSlideContent,
} from "@/lib/insights";
import { type SlideReference, parseSlideReferences } from "@/lib/slides";
import { FlowHeader } from "@/components/flow-header";

const NEUTRAL_INDICATOR = "rgba(255,255,255,0.28)";

// Resolve the color of the block a recommendation targets. Returns null for
// whole-slide recommendations (targetBlock === -1) or when the block is missing.
function blockColor(blocks: SlideBlock[], targetBlock: number): string | null {
  if (targetBlock < 0) return null;
  const block =
    blocks.find((b) => b.index === targetBlock) ?? blocks[targetBlock];
  return block?.color ?? null;
}

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
  const [slides, setSlides] = useState<SlideReference[]>([]);
  const [active, setActive] = useState(0);
  const [hoveredRec, setHoveredRec] = useState<number | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgBox, setImgBox] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  // The slide is object-contain'd inside a flexible container, so its rendered
  // box is letterboxed. Measure the <img> relative to its offset parent so the
  // hover overlay can be positioned over the actual image, not the container.
  const measureImage = useCallback(() => {
    const el = imgRef.current;
    if (!el) return;
    setImgBox({
      left: el.offsetLeft,
      top: el.offsetTop,
      width: el.offsetWidth,
      height: el.offsetHeight,
    });
  }, []);

  useEffect(() => {
    measureImage();
    setHoveredRec(null);
    window.addEventListener("resize", measureImage);
    return () => window.removeEventListener("resize", measureImage);
  }, [measureImage, active]);

  // Different slides can render at different sizes (aspect ratio, letterboxing),
  // so observe the image element itself to keep the overlay box in sync.
  useEffect(() => {
    const el = imgRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => measureImage());
    observer.observe(el);
    return () => observer.disconnect();
  }, [measureImage, active]);

  useEffect(() => {
    const stored = sessionStorage.getItem("perceptResults");
    const storedSlides = sessionStorage.getItem("perceptSlides");

    let nextResults: SlideResult[] = [];
    let nextSlides: SlideReference[] = [];

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
        nextSlides = parseSlideReferences(parsed);
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
            Upload a presentation to convert slides and view Gemini scores.
          </p>
          <Link
            href="/upload"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#c7f04b] px-6 py-2.5 text-[13.5px] font-semibold text-[#0a0a0a] transition hover:bg-[#d4f56b]"
          >
            <Upload className="h-4 w-4" />
            Go to upload
          </Link>
        </div>
      </main>
    );
  }

  const current = results[active];
  const { insight, recommendations, blocks } = resolveSlideContent(current);

  const hovered = hoveredRec !== null ? recommendations[hoveredRec] : null;
  let overlay: {
    left: number;
    top: number;
    width: number;
    height: number;
    color: string | null;
  } | null = null;
  if (hovered && imgBox) {
    // KNOWN LIMITATION: rasterized PNGs carry no layout metadata, so we split
    // the image into evenly-sized horizontal bands, one per block. This is only
    // accurate for decks using the standard stacked full-width block template.
    const count = blocks.length;
    // Treat -1, "no blocks", and any out-of-range index the model may emit as a
    // whole-slide highlight so hovering always produces visible feedback.
    const inRange = hovered.targetBlock >= 0 && hovered.targetBlock < count;
    const topFrac = inRange ? hovered.targetBlock / count : 0;
    const heightFrac = inRange ? 1 / count : 1;
    overlay = {
      left: imgBox.left,
      top: imgBox.top + topFrac * imgBox.height,
      width: imgBox.width,
      height: heightFrac * imgBox.height,
      color: inRange ? blockColor(blocks, hovered.targetBlock) : null,
    };
  }

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
                {slides[i]?.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={slides[i].imageUrl}
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
          {slides[active]?.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imgRef}
              src={slides[active].imageUrl}
              alt={`Slide ${active + 1}`}
              onLoad={measureImage}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <p className="text-[12px] text-white/20">No preview</p>
          )}

          {overlay && (
            <div
              aria-hidden
              className="pointer-events-none absolute z-10 rounded-md transition-all duration-150"
              style={{
                left: overlay.left,
                top: overlay.top,
                width: overlay.width,
                height: overlay.height,
                backgroundColor: overlay.color
                  ? `color-mix(in srgb, ${overlay.color} 30%, transparent)`
                  : "rgba(255,255,255,0.08)",
                boxShadow: [
                  // bright ring around the targeted band
                  `inset 0 0 0 2.5px ${overlay.color ?? "rgba(255,255,255,0.95)"}`,
                  // colored glow to draw the eye
                  `0 0 26px 4px ${
                    overlay.color
                      ? `color-mix(in srgb, ${overlay.color} 65%, transparent)`
                      : "rgba(255,255,255,0.45)"
                  }`,
                  // spotlight: dim everything outside the band
                  "0 0 0 9999px rgba(0,0,0,0.5)",
                ].join(", "),
              }}
            />
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
            <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
              {recommendations.map((rec, j) => {
                const color = blockColor(blocks, rec.targetBlock);
                const isHovered = hoveredRec === j;
                return (
                  <div
                    key={j}
                    onMouseEnter={() => setHoveredRec(j)}
                    onMouseLeave={() =>
                      setHoveredRec((cur) => (cur === j ? null : cur))
                    }
                    className={`flex cursor-default items-start gap-2.5 rounded-md border-l-2 py-1 pr-1 pl-2.5 transition-colors ${
                      isHovered ? "bg-white/[0.04]" : "hover:bg-white/[0.025]"
                    }`}
                    style={{ borderColor: color ?? NEUTRAL_INDICATOR }}
                  >
                    <span
                      className="mt-1 h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: color ?? NEUTRAL_INDICATOR }}
                    />
                    <p className="text-[12px] leading-snug text-white/50">
                      {rec.text}
                    </p>
                  </div>
                );
              })}
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
