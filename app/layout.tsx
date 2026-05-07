import type { Metadata } from "next";
import { Syne, Inter } from "next/font/google";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Percept",
  description: "Neuroscience-powered slide analysis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${syne.variable} ${inter.variable} bg-[#020817] text-white`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
