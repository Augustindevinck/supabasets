import FloatingHeader from "@/components/FloatingHeader";
import WhatAppDoes from "@/components/WhatAppDoes";
import FAQ from "@/components/FAQ";

export default function Page() {
  return (
    <>
      <FloatingHeader />

      <main>
        <section className="w-full min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center gap-12 px-4 sm:px-6 lg:px-8 mx-auto w-[98%] sm:w-[85%] lg:w-[70%]">
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
              Proposition de valeur clair et directe
            </h1>

            <p className="text-lg opacity-80">
              Mettre un élément animé comme un texte qui change, ou alors commencer à engager en demandant une info ou une action
            </p>

            <a
              className="btn btn-primary"
              href="/blog"
              target="_blank"
            >
              CTA (Appel à {`'`}action)
            </a>
          </div>
        </section>

        <WhatAppDoes />
        <FAQ />
      </main>
    </>
  );
}
