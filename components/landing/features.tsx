import type { ReactNode } from "react";
import { Eye, Gauge, Lightbulb, Zap } from "lucide-react";

export function Features() {
  return (
    <section id="features" className="bg-[#f3f1e7] px-6 pb-28 pt-20 text-[#10231a]">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#3c6b4f]">
            Why Percept
          </span>
          <h2 className="font-display mt-4 text-[34px] font-bold leading-tight tracking-tight sm:text-[42px]">
            Most slide tools check spelling.
            <br />
            We check whether you were understood.
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-[#10231a]/60">
            Every deck runs through a neural encoding model trained on fMRI
            recordings of the human brain. The result is measurable, not a hunch.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <FeatureCard
            wide
            icon={<Eye className="h-5 w-5" />}
            title="Attention heatmaps"
            desc="A Grad-CAM overlay shows exactly where the brain looks first — and what it ignores. Catch buried headlines before your audience does."
          />
          <FeatureCard
            icon={<Gauge className="h-5 w-5" />}
            title="Cognitive load score"
            desc="Know when a slide is doing too much, instantly."
          />
          <FeatureCard
            icon={<Lightbulb className="h-5 w-5" />}
            title="Plain-English advice"
            desc="LLM-written fixes, ranked by impact — no jargon."
          />
          <FeatureCard
            wide
            icon={<Zap className="h-5 w-5" />}
            title="Results in seconds"
            desc="Upload a full deck and get per-slide cognitive scores back before your coffee cools. Built for the night before the big talk."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  wide,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border border-[#10231a]/10 bg-white/60 p-7 transition hover:border-[#3c6b4f]/40 hover:bg-white ${
        wide ? "md:col-span-2" : ""
      }`}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10231a] text-[#c7f04b]">
        {icon}
      </span>
      <h3 className="font-display mt-5 text-[19px] font-semibold tracking-tight">
        {title}
      </h3>
      <p className="mt-2 text-[14.5px] leading-relaxed text-[#10231a]/60">
        {desc}
      </p>
    </div>
  );
}
