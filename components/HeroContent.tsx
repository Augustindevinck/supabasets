"use client";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { Button } from "@/components/ui/moving-border";

export default function HeroContent() {
  return (
    <HeroHighlight>
      <div className="flex flex-col items-center justify-center text-center gap-12 px-4 sm:px-6 lg:px-8 mx-auto w-[98%] sm:w-[85%] lg:w-[70%]">
        <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900">
          Proposition de valeur{" "}
          <Highlight>
            claire et directe
          </Highlight>
        </h1>

        <p className="text-lg opacity-80 text-gray-600">
          Mettre un élément animé comme un texte qui change, ou alors commencer à engager en demandant une info ou une action
        </p>

        <Button
          as="a"
          href="/signin"
          borderRadius="0.75rem"
          className="text-base sm:text-lg font-semibold"
        >
          CTA (Appel à l&apos;action)
        </Button>
      </div>
    </HeroHighlight>
  );
}
