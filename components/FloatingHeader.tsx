
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ButtonSignin from "./ButtonSignin";
import config from "@/config";

const FloatingHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex justify-center py-4">
      <div 
        className={`
          flex justify-between items-center px-8 py-4 rounded-3xl bg-white/80 backdrop-blur-sm
          transition-all duration-300 ease-in-out
          ${isScrolled 
            ? 'w-[94%] sm:w-[90%] lg:w-[75%]' 
            : 'w-[98%] sm:w-[94%] lg:w-[85%]'
          }
        `}
      >
        <Link
          href="/"
          className="font-extrabold text-lg tracking-tight"
          title={`${config.appName} homepage`}
        >
          {config.appName}
        </Link>
        <ButtonSignin text="Login" />
      </div>
    </header>
  );
};

export default FloatingHeader;
