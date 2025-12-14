"use client";

import { Tabs } from "@/components/ui/tabs";

const AnimatedTabsSection = () => {
  const tabs = [
    {
      title: "Fonctionnalité 1",
      value: "feature1",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-blue-600 to-blue-800">
          <p className="mb-4">Fonctionnalité principale 1</p>
          <p className="text-base md:text-lg font-normal opacity-90">
            Remplacer par la description détaillée de cette fonctionnalité et ses bénéfices pour vos utilisateurs.
          </p>
        </div>
      ),
    },
    {
      title: "Fonctionnalité 2",
      value: "feature2",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-600 to-purple-800">
          <p className="mb-4">Fonctionnalité principale 2</p>
          <p className="text-base md:text-lg font-normal opacity-90">
            Remplacer par la description détaillée de cette fonctionnalité et ses bénéfices pour vos utilisateurs.
          </p>
        </div>
      ),
    },
    {
      title: "Fonctionnalité 3",
      value: "feature3",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-pink-600 to-pink-800">
          <p className="mb-4">Fonctionnalité principale 3</p>
          <p className="text-base md:text-lg font-normal opacity-90">
            Remplacer par la description détaillée de cette fonctionnalité et ses bénéfices pour vos utilisateurs.
          </p>
        </div>
      ),
    },
    {
      title: "Fonctionnalité 4",
      value: "feature4",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-green-600 to-green-800">
          <p className="mb-4">Fonctionnalité principale 4</p>
          <p className="text-base md:text-lg font-normal opacity-90">
            Remplacer par la description détaillée de cette fonctionnalité et ses bénéfices pour vos utilisateurs.
          </p>
        </div>
      ),
    },
    {
      title: "Fonctionnalité 5",
      value: "feature5",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-orange-600 to-orange-800">
          <p className="mb-4">Fonctionnalité principale 5</p>
          <p className="text-base md:text-lg font-normal opacity-90">
            Remplacer par la description détaillée de cette fonctionnalité et ses bénéfices pour vos utilisateurs.
          </p>
        </div>
      ),
    },
  ];

  return (
    <section className="w-full bg-base-100 py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-[98%] sm:w-[85%] lg:w-[70%]">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">
            Que fait l&apos;app
          </h2>
          <p className="text-lg opacity-80">
            Explorez les fonctionnalités principales et les bénéfices pour vos utilisateurs
          </p>
        </div>

        <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative flex flex-col max-w-5xl mx-auto w-full items-start justify-start">
          <Tabs 
            tabs={tabs}
            containerClassName="bg-gray-100 dark:bg-gray-900 rounded-lg p-1 gap-2"
            tabClassName="px-3 py-2 md:px-4 md:py-3 text-sm md:text-base"
          />
        </div>
      </div>
    </section>
  );
};

export default AnimatedTabsSection;
