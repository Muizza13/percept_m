"use client";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

export type FlowStep = "upload" | "review" | "analyze";

const STEPS: { id: FlowStep; label: string }[] = [
  { id: "upload", label: "Upload" },
  { id: "review", label: "Review" },
  { id: "analyze", label: "Analyze" },
];

export function FlowHeader({ current }: { current: FlowStep }) {
  const activeIndex = STEPS.findIndex((s) => s.id === current);
  const progress = ((activeIndex + 1) / STEPS.length) * 100;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#0b1711]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            aria-label="Back to home"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/55 transition hover:border-white/25 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Link href="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="font-display text-[16px] font-semibold tracking-tight text-white">
              Percept
            </span>
          </Link>
        </div>

        <ol className="hidden items-center gap-1 sm:flex">
          {STEPS.map((step, i) => {
            const done = i < activeIndex;
            const active = i === activeIndex;
            return (
              <li key={step.id} className="flex items-center gap-1">
                <span
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] transition",
                    active && "bg-white/[0.06] text-white",
                    done && "text-white/60",
                    !active && !done && "text-white/30",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border text-[11px] font-semibold",
                      active &&
                        "border-[#c7f04b] bg-[#c7f04b] text-[#10231a]",
                      done && "border-[#c7f04b]/30 bg-[#c7f04b]/15 text-[#c7f04b]",
                      !active && !done && "border-white/15 text-white/40",
                    )}
                  >
                    {done ? <Check className="h-3 w-3" /> : i + 1}
                  </span>
                  {step.label}
                </span>
                {i < STEPS.length - 1 && (
                  <span className="h-px w-5 bg-white/10" />
                )}
              </li>
            );
          })}
        </ol>

        <span className="text-[13px] font-medium text-white/40 sm:hidden">
          Step {activeIndex + 1} of {STEPS.length}
        </span>
      </div>

      <div className="h-0.5 w-full bg-white/[0.04]">
        <div
          className="h-full bg-[#c7f04b] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}
