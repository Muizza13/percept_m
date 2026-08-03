import Link from "next/link";
import { Logo } from "@/components/logo";

const footerLinks = {
  Project: [
    { label: "Overview", href: "/" },
    { label: "Theoretical grounding", href: "/#science" },
    { label: "Pipeline", href: "/#how" },
  ],
  Pages: [
    { label: "About", href: "/about" },
    { label: "Team", href: "/#team" },
    { label: "Upload", href: "/upload" },
  ],
  Analysis: [{ label: "Results", href: "/analysis" }],
} as const;

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0b1711] px-6 pb-10 pt-16">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Logo />
            <span className="font-display text-[17px] font-semibold tracking-tight">
              Percept
            </span>
          </div>
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-white/45">
            Slide evaluation for visual communication quality. Group 10,
            Department of Computer Science and Engineering, IUST Kashmir.
          </p>
        </div>

        {Object.entries(footerLinks).map(([heading, items]) => (
          <div key={heading}>
            <p className="text-[13px] font-semibold text-white/80">{heading}</p>
            <ul className="mt-4 space-y-2.5">
              {items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[13.5px] text-white/45 transition hover:text-white/80"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-14 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 sm:flex-row">
        <p className="text-[13px] text-white/35">
          © 2026 Percept · IUST CSE Group 10
        </p>
        <p className="text-[13px] text-white/35">
          Supervisor: Dr. Sahil Sholla, Assistant Professor
        </p>
      </div>
    </footer>
  );
}
