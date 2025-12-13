"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";

export default function HeroContent() {
  return (
    <HeroHighlight>
      <div className="flex flex-col items-center justify-center text-center gap-12 px-4 sm:px-6 lg:px-8 mx-auto w-[98%] sm:w-[85%] lg:w-[70%]">
        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="text-4xl lg:text-5xl font-extrabold leading-tight text-neutral-900 dark:text-white"
        >
          Proposition de valeur{" "}
          <Highlight className="text-black dark:text-white">
            clair et directe
          </Highlight>
        </motion.h1>

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
