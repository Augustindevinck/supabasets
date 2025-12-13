import FloatingHeader from "@/components/FloatingHeader";
import WhatAppDoes from "@/components/WhatAppDoes";
import FAQ from "@/components/FAQ";
import GridBackground from "@/components/GridBackground";
import Footer from "@/components/Footer";
import HeroContent from "@/components/HeroContent";

export default function Page() {
  return (
    <>
      <FloatingHeader />

      <main>
        <section className="w-full min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
          <GridBackground />
          <HeroContent />
        </section>

        <WhatAppDoes />
        <FAQ />
      </main>

      <Footer />
    </>
  );
}
