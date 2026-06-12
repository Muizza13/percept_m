"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

const links = [
  { label: "Product", href: "/#product" },
  { label: "The Science", href: "/#science" },
  { label: "How it works", href: "/#how" },
  { label: "Team", href: "/#team" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={cn(
          "font-body flex w-full max-w-6xl items-center justify-between rounded-full border px-3 py-2.5 transition-all duration-300",
          scrolled
            ? "border-white/10 bg-[#0d1a13]/85 backdrop-blur-xl shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6)]"
            : "border-white/[0.06] bg-white/[0.03] backdrop-blur-md",
        )}
      >
        <Link href="/" className="flex items-center gap-2.5 pl-2">
          <Logo />
          <span className="font-display text-[17px] font-semibold tracking-tight text-white">
            Percept
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="rounded-full px-3.5 py-1.5 text-[13.5px] text-white/65 transition hover:bg-white/[0.06] hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/about"
            className="hidden rounded-full px-4 py-2 text-[13.5px] text-white/70 transition hover:text-white sm:block"
          >
            About
          </Link>
          <Link
            href="/upload"
            className="rounded-full bg-[#c7f04b] px-4 py-2 text-[13.5px] font-semibold text-[#10231a] transition hover:bg-[#d4f56b]"
          >
            Analyze slides
          </Link>
        </div>
      </nav>
    </header>
  );
}
