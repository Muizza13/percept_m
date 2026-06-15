"use client";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type FlowStep = "upload" | "review" | "analyze";

const STEPS: { id: FlowStep; label: string }[] = [
  { id: "upload", label: "Upload" },
  { id: "review", label: "Review" },
  { id: "analyze", label: "Analyze" },
];

export function FlowHeader({ current }: { current: FlowStep }) {
  const activeIndex = STEPS.findIndex((s) => s.id === current);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.07] bg-[#0a0a0a]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <div className="flex items-center gap-1">
          <Link
            href="/"
            aria-label="Back to home"
            className="flex h-8 w-8 items-center justify-center rounded-md text-white/45 transition hover:bg-white/[0.06] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="font-display text-[15px] font-semibold tracking-tight text-white/90"
          >
            Percept
          </Link>
        </div>

        <ol className="hidden items-center gap-5 sm:flex">
          {STEPS.map((step, i) => {
            const done = i < activeIndex;
            const active = i === activeIndex;
            return (
              <li key={step.id} className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium tabular-nums transition",
                    active && "bg-[#c7f04b] text-[#0a0a0a]",
                    done && "text-[#c7f04b]",
                    !active && !done && "text-white/30",
                  )}
                >
                  {done ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                <span
                  className={cn(
                    "text-[13px] transition",
                    active && "font-medium text-white",
                    done && "text-white/45",
                    !active && !done && "text-white/30",
                  )}
                >
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>

        <span className="text-[12.5px] tabular-nums text-white/35 sm:hidden">
          {activeIndex + 1} / {STEPS.length}
        </span>
      </div>
    </header>
  );
}
