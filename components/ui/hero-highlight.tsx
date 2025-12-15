"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

export const HeroHighlight = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  return (
    <div className={cn("group relative bg-white min-h-screen flex items-center justify-center", containerClassName)}>
      <div className={cn("relative z-20", className)}>{children}</div>
    </div>
  );
};

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.span
      suppressHydrationWarning
      initial={{
        backgroundSize: "0% 100%",
      }}
      animate={{
        backgroundSize: "100% 100%",
      }}
      transition={{
        duration: 1.5,
        ease: "linear",
      }}
      style={{
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        display: "inline",
        backgroundImage: "linear-gradient(to right, hsl(213, 96%, 64%), hsl(213, 96%, 60%))"
      }}
      className={cn(
        `relative inline-block rounded-lg px-1 pb-1 text-blue-600`,
        className,
      )}
    >
      {children}
    </motion.span>
  );
};
