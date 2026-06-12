import { Check } from "lucide-react";

const highlights = [
  "Trained on thousands of fMRI scan-image pairs",
  "Predicts attention, comprehension & load per slide",
  "Grad-CAM maps the precise focal points",
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
            The science
          </span>
          <h2 className="font-display mt-4 text-[34px] font-bold leading-tight tracking-tight sm:text-[42px]">
            Not opinions.
            <br />
            A model of your audience&apos;s brain.
          </h2>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-white/55">
            Percept is powered by TRIBE v2, a neural encoder trained to predict
            blood-oxygen responses across the visual cortex. When it scores a
            slide, it is simulating how an actual brain would process it.
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

      <div className="mt-5 space-y-4">
        <ScoreBar label="Attention" value={87} note="Above average" />
        <ScoreBar label="Comprehension" value={72} note="Needs work" />
        <ScoreBar label="Cognitive load" value={34} note="Optimal" />
      </div>
    </div>
  );
}

function ScoreBar({
  label,
  value,
  note,
}: {
  label: string;
  value: number;
  note: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[13px] text-white/65">{label}</span>
        <span className="font-display text-[15px] font-semibold text-white">
          {value}
          <span className="text-[11px] text-white/35">/100</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
        <div
          className="h-full rounded-full bg-[#c7f04b]"
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="mt-1 text-[11px] text-white/35">{note}</p>
    </div>
  );
}
