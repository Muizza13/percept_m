import { CTA } from "@/components/landing/cta";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Science } from "@/components/landing/science";
import { TeamSection } from "@/components/landing/team-section";

export default function Home() {
  return (
    <main className="font-body min-h-screen overflow-hidden bg-[#0b1711] text-white">
      <Hero />
      <Features />
      <Science />
      <HowItWorks />
      <TeamSection />
      <CTA />
      <Footer />
    </main>
  );
}
