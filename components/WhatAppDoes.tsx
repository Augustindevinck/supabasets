import React from "react";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: "⚡",
    title: "Remplacer par titre de fonctionnalité",
    description: "Ajouter une brève description de ce que fait cette fonctionnalité et comment elle aide l'utilisateur.",
  },
  {
    icon: "🎯",
    title: "Remplacer par titre de fonctionnalité",
    description: "Ajouter une brève description de ce que fait cette fonctionnalité et comment elle aide l'utilisateur.",
  },
  {
    icon: "🔒",
    title: "Remplacer par titre de fonctionnalité",
    description: "Ajouter une brève description de ce que fait cette fonctionnalité et comment elle aide l'utilisateur.",
  },
];

const WhatAppDoes = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 mx-auto w-11/12 sm:w-9/12 lg:w-4/5">
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">
          Que fais l'app
        </h2>
        <p className="text-lg opacity-80">
          Expliquez les fonctionnalités principales et les bénéfices pour vos utilisateurs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-6 rounded-lg bg-base-100 hover:bg-base-200 transition-colors"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-sm opacity-80">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhatAppDoes;
