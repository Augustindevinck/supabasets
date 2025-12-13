
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSidebar } from "@/components/ui/sidebar";

interface SidebarLogoProps {
  href?: string;
  logoText?: string;
}

export default function SidebarLogo({ 
  href = "/", 
  logoText = "Template" 
}: SidebarLogoProps) {
  const { open, animate } = useSidebar();

  return (
    <Link
      href={href}
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black dark:text-white"
      aria-label={`Go to ${logoText} home`}
    >
      <div 
        className="h-5 w-6 shrink-0 rounded-lg bg-black dark:bg-white" 
        aria-hidden="true"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{
          opacity: animate ? (open ? 1 : 0) : 1,
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
        }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        {logoText}
      </motion.span>
    </Link>
  );
}
