import type { ReactNode } from "react";
import { Brain, Sparkles, Upload } from "lucide-react";

const steps: {
  n: string;
  title: string;
  desc: string;
  icon: ReactNode;
}[] = [
  {
    n: "01",
    title: "Upload your deck",
    desc: "Drop a .pptx, .ppt or .pdf. Percept converts every slide into a clean, analysis-ready image.",
    icon: <Upload className="h-5 w-5" />,
  },
  {
    n: "02",
    title: "The model reads it",
    desc: "TRIBE v2 predicts the brain's response and Grad-CAM maps exactly where attention lands.",
    icon: <Brain className="h-5 w-5" />,
  },
  {
    n: "03",
    title: "Get your fixes",
    desc: "Three cognitive scores per slide plus ranked, plain-English suggestions to improve them.",
    icon: <Sparkles className="h-5 w-5" />,
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-[#0b1711] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#c7f04b]">
            How it works
          </span>
          <h2 className="font-display mt-4 text-[34px] font-bold tracking-tight sm:text-[42px]">
            From slide to brain insight in three steps
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="relative rounded-3xl border border-white/[0.08] bg-white/[0.02] p-7 transition hover:border-[#c7f04b]/30"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c7f04b] text-[#10231a]">
                  {s.icon}
                </span>
                <span className="font-display text-[28px] font-bold text-white/10">
                  {s.n}
                </span>
              </div>
              <h3 className="font-display mt-6 text-[19px] font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-white/55">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
