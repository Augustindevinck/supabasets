"use client";

import { useRef, useState } from "react";
import type { JSX } from "react";

// <FAQ> component is a lsit of <Item> component
// Just import the FAQ & add your FAQ content to the const faqList arrayy below.

interface FAQItemProps {
  question: string;
  answer: JSX.Element;
}

const faqList: FAQItemProps[] = [
  {
    question: "Remplacer par votre première question",
    answer: <div className="space-y-2 leading-relaxed">Ajouter la réponse à cette question. Soyez clair et concis pour aider vos utilisateurs à comprendre.</div>,
  },
  {
    question: "Remplacer par votre deuxième question",
    answer: (
      <p>
        Ajouter la réponse à cette question. Soyez clair et concis pour aider vos utilisateurs à comprendre.
      </p>
    ),
  },
  {
    question: "Remplacer par votre troisième question",
    answer: (
      <div className="space-y-2 leading-relaxed">Ajouter la réponse à cette question. Soyez clair et concis pour aider vos utilisateurs à comprendre.</div>
    ),
  },
  {
    question: "Remplacer par votre quatrième question",
    answer: (
      <div className="space-y-2 leading-relaxed">Ajouter la réponse à cette question. Soyez clair et concis pour aider vos utilisateurs à comprendre.</div>
    ),
  },
];

const FaqItem = ({ item }: { item: FAQItemProps }) => {
  const accordion = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <button
        className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-gray-200"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
      >
        <span
          className={`flex-1 text-base-content ${isOpen ? "text-blue-500" : ""}`}
        >
          {item?.question}
        </span>
        <svg
          className={`flex-shrink-0 w-4 h-4 ml-auto fill-current`}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center transition duration-200 ease-out ${
              isOpen && "rotate-180"
            }`}
          />
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center rotate-90 transition duration-200 ease-out ${
              isOpen && "rotate-180 hidden"
            }`}
          />
        </svg>
      </button>

      <div
        ref={accordion}
        className={`transition-all duration-300 ease-in-out opacity-80 overflow-hidden`}
        style={
          isOpen
            ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className="pb-5 leading-relaxed">{item?.answer}</div>
      </div>
    </li>
  );
};

const FAQ = () => {
  return (
    <section id="faq" className="w-full bg-base-100 py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-[98%] sm:w-[85%] lg:w-[70%]">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">
            Questions Fréquemment Posées
          </h2>
          <p className="text-lg opacity-80">
            Trouvez les réponses aux questions les plus communes
          </p>
        </div>

        <ul>
          {faqList.map((item, i) => (
            <FaqItem key={i} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FAQ;
