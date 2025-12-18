"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSidebar } from "@/components/ui/sidebar";

interface SidebarLogoProps {
  href?: string;
  logoText?: string;
}

const TRANSITION_DURATION = 0.2;

export default function SidebarLogo({
  href = "/",
  logoText = "Template",
}: SidebarLogoProps) {
  const { isExpanded } = useSidebar();

  return (
    <Link
      href={href}
      className="flex items-center gap-2 py-2 px-1 rounded-lg hover:bg-gray-50 transition-colors duration-150"
      aria-label={`Aller à ${logoText}`}
    >
      <div
        className="h-8 w-8 shrink-0 rounded-lg bg-gray-900 flex items-center justify-center"
        aria-hidden="true"
      >
        <span className="text-white font-bold text-sm">
          {logoText.charAt(0).toUpperCase()}
        </span>
      </div>
      <motion.span
        initial={false}
        animate={{
          opacity: isExpanded ? 1 : 0,
          width: isExpanded ? "auto" : 0,
        }}
        transition={{
          duration: TRANSITION_DURATION,
          ease: "easeInOut",
        }}
        className="font-semibold text-gray-900 whitespace-nowrap overflow-hidden"
      >
        {logoText}
      </motion.span>
    </Link>
  );
}
