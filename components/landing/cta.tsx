import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section id="try" className="bg-[#0b1711] px-6 py-24">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[36px] bg-[#c7f04b] px-8 py-16 text-center text-[#10231a]">
        <div className="pointer-events-none absolute inset-0 bg-blueprint opacity-[0.12]" />
        <div className="relative">
          <h2 className="font-display mx-auto max-w-2xl text-[34px] font-bold leading-tight tracking-tight sm:text-[46px]">
            Run the pipeline on a presentation
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[16px] text-[#10231a]/70">
            Upload a .ppt, .pptx, or .pdf to convert slides, score them with
            Gemini, and inspect the results.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/upload"
              className="group flex items-center gap-2 rounded-full bg-[#10231a] px-7 py-3.5 text-[14px] font-semibold text-white transition hover:bg-[#16321f]"
            >
              Go to upload
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-[#10231a]/25 px-7 py-3.5 text-[14px] font-semibold text-[#10231a] transition hover:bg-[#10231a]/[0.06]"
            >
              About the project
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
