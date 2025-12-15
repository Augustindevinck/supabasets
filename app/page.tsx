import ResizableHeader from "@/components/ResizableHeader";
import FeaturesSection from "@/components/FeaturesSection";
import FAQ from "@/components/FAQ";
import GridBackground from "@/components/GridBackground";
import Footer from "@/components/Footer";
import HeroContent from "@/components/HeroContent";

export default function Page() {
  return (
    <div className="relative">
      <ResizableHeader />

      <main>
        <section className="w-full min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
          <GridBackground />
          <HeroContent />
        </section>

        <FeaturesSection />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
