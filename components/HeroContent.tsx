"use client";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";

export default function HeroContent() {
  return (
    <HeroHighlight>
      <div className="flex flex-col items-center justify-center text-center gap-12 px-4 sm:px-6 lg:px-8 mx-auto w-[98%] sm:w-[85%] lg:w-[70%]">
        <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
          Proposition de valeur{" "}
          <Highlight className="text-black dark:text-white">
            clair et directe
          </Highlight>
        </h1>

        <p className="text-lg opacity-80">
          Mettre un élément animé comme un texte qui change, ou alors commencer à engager en demandant une info ou une action
        </p>

        <a
          className="btn btn-primary"
          href="/signin"
        >
          CTA (Appel à l&apos;action)
        </a>
      </div>
    </HeroHighlight>
  );
}
