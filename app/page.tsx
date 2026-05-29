import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import CtaSection from "@/components/CtaSection";
import SiteFooter from "@/components/SiteFooter";
import FirstVisitPopup from "@/components/FirstVisitPopup";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <CtaSection />
      </main>
      <SiteFooter />
      <FirstVisitPopup />
    </>
  );
}
