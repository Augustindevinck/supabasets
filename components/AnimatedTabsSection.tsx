"use client";

import { Tabs } from "@/components/ui/tabs";

const AnimatedTabsSection = () => {
  const tabs = [
    {
      title: "Fonctionnalité 1",
      value: "feature1",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 sm:p-8 md:p-10 text-lg sm:text-2xl md:text-4xl font-bold text-white bg-gradient-to-br from-blue-600 to-blue-800">
          <p className="mb-4">Fonctionnalité principale 1</p>
          <p className="text-sm sm:text-base md:text-lg font-normal opacity-90">
            Remplacer par la description détaillée de cette fonctionnalité et ses bénéfices pour vos utilisateurs.
          </p>
        </div>
      ),
    },
    {
      title: "Fonctionnalité 2",
      value: "feature2",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 sm:p-8 md:p-10 text-lg sm:text-2xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-600 to-purple-800">
          <p className="mb-4">Fonctionnalité principale 2</p>
          <p className="text-sm sm:text-base md:text-lg font-normal opacity-90">
            Remplacer par la description détaillée de cette fonctionnalité et ses bénéfices pour vos utilisateurs.
          </p>
        </div>
      ),
    },
    {
      title: "Fonctionnalité 3",
      value: "feature3",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 sm:p-8 md:p-10 text-lg sm:text-2xl md:text-4xl font-bold text-white bg-gradient-to-br from-blue-600 to-blue-800">
          <p className="mb-4">Fonctionnalité principale 3</p>
          <p className="text-sm sm:text-base md:text-lg font-normal opacity-90">
            Remplacer par la description détaillée de cette fonctionnalité et ses bénéfices pour vos utilisateurs.
          </p>
        </div>
      ),
    },
  ];

  return (
    <section className="w-full bg-base-100 py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-[98%] sm:w-[85%] lg:w-[70%]">
        <div className="text-center mb-12 sm:mb-14 md:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3 sm:mb-4">
            Que fait l&apos;app
          </h2>
          <p className="text-base sm:text-lg opacity-80">
            Explorez les fonctionnalités principales et les bénéfices pour vos utilisateurs
          </p>
        </div>

        <div className="h-[16rem] sm:h-[24rem] md:h-[40rem] [perspective:1000px] relative flex flex-col max-w-5xl mx-auto w-full items-start justify-start">
          <Tabs 
            tabs={tabs}
            containerClassName="bg-gray-100 dark:bg-gray-900 rounded-lg p-1 gap-1 sm:gap-2 flex-wrap"
            tabClassName="px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 text-xs sm:text-sm md:text-base whitespace-nowrap"
          />
        </div>
      </div>
    </section>
  );
};

export default AnimatedTabsSection;
