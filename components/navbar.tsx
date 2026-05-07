"use client";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 backdrop-blur-md bg-black/40 px-8 py-4 flex items-center justify-between">
      <Link
        href="/"
        className="text-white font-semibold text-lg tracking-tight"
      >
        Percept
      </Link>
      <div className="flex gap-8 text-sm text-white/60">
        <Link href="/" className="hover:text-white transition">
          Home
        </Link>
        <Link href="/upload" className="hover:text-white transition">
          Upload
        </Link>
      </div>
    </nav>
  );
}
