import Link from "next/link";
import { Logo } from "@/components/logo";

const footerLinks = {
  Product: [
    { label: "Overview", href: "/" },
    { label: "The science", href: "/#science" },
    { label: "How it works", href: "/#how" },
    { label: "Pricing", href: "/#pricing" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Team", href: "/#team" },
    { label: "Upload", href: "/upload" },
  ],
  Resources: [{ label: "Analysis", href: "/analysis" }],
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
            Brain-trained slide analysis. Built at IUST Kashmir, Department of
            Computer Science & Engineering.
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
          © 2026 Percept. All rights reserved.
        </p>
        <div className="flex items-center gap-2 text-[13px] text-white/35">
          <span className="p-pulse-dot h-1.5 w-1.5 rounded-full bg-[#c7f04b]" />
          All systems operational
        </div>
      </div>
    </footer>
  );
}
