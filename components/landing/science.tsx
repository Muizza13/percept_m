import { Check } from "lucide-react";

const highlights = [
  "Grounded in cognitive load theory (Sweller, 1988)",
  "Informed by multimedia learning (Mayer, 2009) and dual coding (Paivio, 1991)",
  "Scores produced by a vision-language model against a fixed JSON schema",
] as const;

export function Science() {
  return (
    <section
      id="science"
      className="relative overflow-hidden bg-[#0b1711] px-6 py-28"
    >
      <div className="glow-lime pointer-events-none absolute right-0 top-10 -z-0 h-[420px] w-[520px]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <div>
          <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#c7f04b]">
            Theoretical grounding
          </span>
          <h2 className="font-display mt-4 text-[34px] font-bold leading-tight tracking-tight sm:text-[42px]">
            Cognitive science literature,
            <br />
            applied as heuristic scores.
          </h2>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-white/55">
            Percept does not measure neural responses. It applies a
            general-purpose vision-language model to rendered slide images and
            asks for structured ratings of attention, comprehension, and
            cognitive load. The dimensions are motivated by Sweller&apos;s
            cognitive load theory (1988), Mayer&apos;s multimedia learning
            principles (2009), and Paivio&apos;s dual coding theory (1991).
          </p>
          <ul className="mt-8 space-y-4">
            {highlights.map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c7f04b] text-[#10231a]">
                  <Check className="h-3 w-3" />
                </span>
                <span className="text-[15px] text-white/70">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <ScoreVisual />
      </div>
    </section>
  );
}

function ScoreVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-[#0e1c14]/70 p-6 backdrop-blur-xl">
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#102118] p-5">
        <div className="p-sweep pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#c7f04b]/25 to-transparent" />
        <div className="h-2.5 w-2/3 rounded-full bg-white/15" />
        <div className="mt-3 h-2 w-1/2 rounded-full bg-white/10" />
        <div className="mt-6 flex gap-3">
          <div className="h-16 flex-1 rounded-lg bg-[#c7f04b]/15 ring-1 ring-[#c7f04b]/30" />
          <div className="h-16 flex-1 rounded-lg bg-white/[0.05]" />
        </div>
        <div className="mt-3 h-2 w-3/4 rounded-full bg-white/10" />
      </div>

      <div className="mt-5 space-y-3">
        <DimensionRow label="Attention" description="Focal point and visual pull" />
        <DimensionRow
          label="Comprehension"
          description="Hierarchy and message clarity"
        />
        <DimensionRow
          label="Cognitive load"
          description="Density and parsing effort"
        />
      </div>
    </div>
  );
}

function DimensionRow({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
      <p className="text-[13px] font-medium text-white/80">{label}</p>
      <p className="mt-0.5 text-[12px] text-white/40">{description}</p>
    </div>
  );
}
