"use client";

import Link from "next/link";
import ButtonSignin from "./ButtonSignin";
import config from "@/config";

const FloatingHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex justify-center py-4">
      <div className="w-[98%] sm:w-[85%] lg:w-[70%] flex justify-between items-center px-8 py-4 rounded-3xl bg-base-100/80 backdrop-blur-sm">
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
