import { useEffect } from "react";
import { env } from "../../config/env.ts";
import CtaSection from "./landing/CtaSection.tsx";
import FeaturesSection from "./landing/FeaturesSection.tsx";
import HeroSection from "./landing/HeroSection.tsx";
import HowItWorksSection from "./landing/HowItWorksSection.tsx";
import TemplatesSection from "./landing/TemplatesSection.tsx";

export default function LandingPage() {
  useEffect(() => {
    document.title = `${env.appName} — Build your business website by hand or with AI`;
  }, []);

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TemplatesSection />
      <CtaSection />
    </>
  );
}
