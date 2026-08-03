import type { ReactNode } from "react";
import { FileImage, Sparkles, Upload } from "lucide-react";

const steps: {
  n: string;
  title: string;
  desc: string;
  icon: ReactNode;
}[] = [
  {
    n: "01",
    title: "Convert the deck",
    desc: "The user uploads a .ppt, .pptx, or .pdf. LibreOffice converts presentations to PDF; Poppler rasterises each page to a PNG cached under a deck identifier.",
    icon: <Upload className="h-5 w-5" />,
  },
  {
    n: "02",
    title: "Score each slide",
    desc: "Each PNG is sent to Google Gemini (gemini-3.5-flash) with a Zod-derived JSON schema requesting attention, comprehension, and cognitive load.",
    icon: <FileImage className="h-5 w-5" />,
  },
  {
    n: "03",
    title: "Explain and recommend",
    desc: "The model returns an insight string and recommendations. Results are held in sessionStorage and shown on the analysis page.",
    icon: <Sparkles className="h-5 w-5" />,
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-[#0b1711] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#c7f04b]">
            Pipeline
          </span>
          <h2 className="font-display mt-4 text-[34px] font-bold tracking-tight sm:text-[42px]">
            From upload to scored slides
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
