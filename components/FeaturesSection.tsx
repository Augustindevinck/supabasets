"use client";

import { useState } from "react";

const FeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState("feature1");

  const features = [
    {
      id: "feature1",
      title: "Automatisation Intelligente",
      description: "Streamlez vos processus métier avec notre système d&apos;automatisation avancé. Réduisez les tâches manuelles de 80% et concentrez-vous sur ce qui compte vraiment.",
      benefits: [
        "Économisez 20+ heures par semaine",
        "Réduisez les erreurs manuelles",
        "Augmentez la productivité de l&apos;équipe",
        "Automatisation sans code requise"
      ],
      gradient: "from-blue-400 to-blue-600"
    },
    {
      id: "feature2",
      title: "Analytics en Temps Réel",
      description: "Obtenez des insights détaillés et exploitables en temps réel. Notre dashboard intuitif vous montre exactement ce qui se passe dans votre business, quand cela arrive.",
      benefits: [
        "Dashboards personnalisables",
        "Rapports exportables automatiques",
        "Alertes intelligentes",
        "Prédictions basées sur l&apos;IA"
      ],
      gradient: "from-purple-400 to-purple-600"
    },
    {
      id: "feature3",
      title: "Intégration Totale",
      description: "Connectez tous vos outils favoris en quelques clics. Notre plateforme s&apos;intègre avec 500+ applications pour créer un écosystème cohérent et puissant.",
      benefits: [
        "Intégration avec 500+ apps",
        "API complète et documentée",
        "Webhooks en temps réel",
        "Sync bidirectionnelle automatique"
      ],
      gradient: "from-green-400 to-green-600"
    }
  ];

  const activeFeatureData = features.find(f => f.id === activeFeature);

  return (
    <section className="w-full bg-white py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 md:mb-24">
      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-14 md:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4">
            Que fait l&apos;app
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Explorez les fonctionnalités principales et les bénéfices pour vos utilisateurs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
          {/* Feature Buttons */}
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id)}
              className={`p-4 sm:p-5 md:p-6 rounded-lg transition-all duration-300 border-2 font-semibold text-left ${
                activeFeature === feature.id
                  ? `border-blue-500 bg-blue-50 text-gray-900`
                  : `border-gray-200 bg-white text-gray-700 hover:border-gray-300`
              }`}
            >
              <span className="text-sm sm:text-base">{feature.title}</span>
            </button>
          ))}
        </div>

        {/* Feature Content */}
        {activeFeatureData && (
          <div className={`bg-gradient-to-br ${activeFeatureData.gradient} rounded-2xl p-8 sm:p-10 md:p-12 text-white animate-fadeIn`}>
            <div className="max-w-2xl">
              {/* Title */}
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5">
                {activeFeatureData.title}
              </h3>

              {/* Main Description */}
              <p className="text-base sm:text-lg md:text-xl opacity-95 mb-8 sm:mb-10 leading-relaxed">
                {activeFeatureData.description}
              </p>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {activeFeatureData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/30 flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm sm:text-base opacity-90">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturesSection;
