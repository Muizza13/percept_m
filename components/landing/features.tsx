import type { ReactNode } from "react";
import { Eye, Gauge, Lightbulb } from "lucide-react";

export function Features() {
  return (
    <section id="features" className="bg-[#f3f1e7] px-6 pb-28 pt-20 text-[#10231a]">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#3c6b4f]">
            Capabilities
          </span>
          <h2 className="font-display mt-4 text-[34px] font-bold leading-tight tracking-tight sm:text-[42px]">
            Heuristic scores for
            <br />
            visual communication quality.
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-[#10231a]/60">
            Each rendered slide is scored by a vision-language model against a
            fixed schema. The scores are a proxy for visual-communication
            quality, not a measurement of neural response.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <FeatureCard
            icon={<Eye className="h-5 w-5" />}
            title="Attention"
            desc="Rates how strongly the slide creates a clear focal point and visual pull."
          />
          <FeatureCard
            icon={<Gauge className="h-5 w-5" />}
            title="Cognitive load"
            desc="Rates visual density, competing elements, and the effort required to parse the slide."
          />
          <FeatureCard
            icon={<Lightbulb className="h-5 w-5" />}
            title="Comprehension and advice"
            desc="Rates how easily a viewer can understand the message and hierarchy, and returns a short insight with recommendations."
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
}: {
  icon: ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-3xl border border-[#10231a]/10 bg-white/60 p-7 transition hover:border-[#3c6b4f]/40 hover:bg-white">
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
