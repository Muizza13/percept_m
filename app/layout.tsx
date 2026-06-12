import type { Metadata } from "next";
import { Sora, Plus_Jakarta_Sans } from "next/font/google";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "500", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Percept — See how your slides land in the brain",
  description:
    "Percept scores your slide decks on attention, comprehension, and cognitive load using brain-trained neural models, then tells you exactly how to improve.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} ${jakarta.variable} bg-[#0b1711] text-white antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
