import HeroSection from "./components/HeroSection";
import AboutServiceSection from "./components/AboutServiceSection";
import FeaturesSection from "./components/FeaturesSection";
import DiagnosisForm from "./components/DiagnosisForm";
import ServiceAreasSection from "./components/ServiceAreasSection";
import HowToUseSection from "./components/HowToUseSection";
import FAQSection from "./components/FAQSection";
import CTASection from "./components/CTASection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutServiceSection />
      <FeaturesSection />
      <DiagnosisForm />
      <ServiceAreasSection />
      <HowToUseSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}
