import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { QuickNavBar } from "@/components/home/QuickNavBar";
import { AgentsSection } from "@/components/home/AgentsSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { EkosistemSection } from "@/components/home/EkosistemSection";
import { PractitionersSection } from "@/components/home/PractitionersSection";
import { StatsSection } from "@/components/home/StatsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CtaSection } from "@/components/home/CtaSection";
import { AboutSection } from "@/components/home/AboutSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30 selection:text-primary-foreground">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <QuickNavBar />
        <FeaturesSection />
        <AgentsSection />
        <EkosistemSection />
        <PractitionersSection />
        <StatsSection />
        <TestimonialsSection />
        <CtaSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
