import Link from "next/link";
import {
  ArrowRight,
  Eye,
  Gauge,
  Grid3x3,
  Lightbulb,
  MoreHorizontal,
  Plus,
} from "lucide-react";

export function Hero() {
  return (
    <section
      id="product"
      className="relative isolate overflow-hidden bg-gradient-to-b from-[#14271c] via-[#13241a] to-[#0b1711] px-6 pb-28 pt-36 sm:pt-40"
    >
      <div className="absolute inset-0 -z-10 bg-blueprint" />
      <div className="glow-lime pointer-events-none absolute left-1/2 top-24 -z-10 h-[520px] w-[820px] -translate-x-1/2" />

      <div className="mx-auto max-w-4xl text-center">
        <div className="p-rise mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-2 pr-3 backdrop-blur">
          <span className="rounded-full bg-[#c7f04b] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#10231a]">
            Live
          </span>
          <span className="text-[13px] text-white/70">
            Neural analysis engine, trained on real fMRI data
          </span>
        </div>

        <h1 className="font-display p-rise text-[44px] font-bold leading-[1.04] tracking-tight text-white sm:text-[64px]">
          See how your slides
          <br />
          <span className="text-[#c7f04b]">land in the brain</span>
        </h1>

        <p
          className="p-rise mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-white/55"
          style={{ animationDelay: "80ms" }}
        >
          Percept scores every slide on attention, comprehension, and cognitive
          load using brain-trained models — then tells you, in plain language,
          exactly what to fix before you present.
        </p>

        <div
          className="p-rise mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ animationDelay: "140ms" }}
        >
          <Link
            href="/upload"
            className="group flex items-center gap-2 rounded-full bg-[#c7f04b] px-6 py-3.5 text-[14px] font-semibold text-[#10231a] transition hover:bg-[#d4f56b]"
          >
            Analyze your deck — free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="#how"
            className="rounded-full border border-white/15 px-6 py-3.5 text-[14px] text-white/80 transition hover:border-white/35 hover:text-white"
          >
            See how it works
          </Link>
        </div>
      </div>

      <ProductCard />
    </section>
  );
}

function ProductCard() {
  const scores = [
    { label: "Attention", icon: <Eye className="h-4 w-4" /> },
    { label: "Comprehension", icon: <Lightbulb className="h-4 w-4" /> },
    { label: "Cognitive load", icon: <Gauge className="h-4 w-4" /> },
    { label: "Heatmap", icon: <Grid3x3 className="h-4 w-4" /> },
  ];

  return (
    <div
      className="p-rise glow-emerald p-float relative mx-auto mt-16 max-w-3xl rounded-3xl border border-white/10 bg-[#0e1c14]/80 p-3 backdrop-blur-xl"
      style={{ animationDelay: "220ms" }}
    >
      <div className="rounded-[20px] border border-white/[0.06] bg-[#10211880] p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-pulse-dot h-2 w-2 rounded-full bg-[#c7f04b]" />
            <p className="text-[14px] font-medium text-white/85">
              Analyze a new deck
            </p>
          </div>
          <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/45">
            TRIBE v2 · ready
          </span>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-3 py-2.5">
          <Link
            href="/upload"
            aria-label="Upload"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 text-white/60 transition hover:border-[#c7f04b]/40 hover:text-[#c7f04b]"
          >
            <Plus className="h-4 w-4" />
          </Link>
          <div className="flex -space-x-2">
            {["#c7f04b", "#7fd1a2", "#4fb8c9"].map((c) => (
              <span
                key={c}
                className="h-7 w-7 rounded-full border-2 border-[#102118]"
                style={{ background: c }}
              />
            ))}
          </div>
          <p className="flex-1 truncate text-[13.5px] text-white/40">
            Drop a .pptx, .pdf or paste a slide…
          </p>
          <Link
            href="/upload"
            aria-label="Run analysis"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c7f04b] text-[#10231a] transition hover:bg-[#d4f56b]"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {scores.map((s) => (
            <span
              key={s.label}
              className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[12.5px] text-white/70"
            >
              <span className="text-[#c7f04b]">{s.icon}</span>
              {s.label}
            </span>
          ))}
          <span className="flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[12.5px] text-white/40">
            <MoreHorizontal className="h-4 w-4" />
          </span>
        </div>
      </div>
    </div>
  );
}
