import { CTA } from "@/components/landing/cta";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Science } from "@/components/landing/science";
import { Stats } from "@/components/landing/stats";
import { TeamSection } from "@/components/landing/team-section";
import { TrustedBy } from "@/components/landing/trusted-by";

export default function Home() {
  return (
    <main className="font-body min-h-screen overflow-hidden bg-[#0b1711] text-white">
      <Hero />
      <TrustedBy />
      <Features />
      <Science />
      <HowItWorks />
      <Stats />
      <TeamSection />
      <CTA />
      <Footer />
    </main>
  );
}
