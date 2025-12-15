"use client";

import HeroButton from "./HeroButton";

export default function HeroSection() {
  return (
    <div className="hero-container w-full min-h-screen bg-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white -z-10" />

      <div className="flex flex-col items-center justify-center text-center gap-8 w-full max-w-3xl">
        {/* Main Title */}
        <h1 className="hero-title text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900">
          Proposition de valeur{" "}
          <span className="hero-highlight">claire et directe</span>
        </h1>

        {/* Description */}
        <p className="hero-description text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl">
          Mettre un élément animé comme un texte qui change, ou alors commencer à engager en demandant une info ou une action
        </p>

        {/* CTA Button */}
        <div className="hero-button-wrapper pt-4">
          <HeroButton href="/signin">
            Commencer maintenant
          </HeroButton>
        </div>
      </div>
    </div>
  );
}
