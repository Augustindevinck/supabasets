
"use client";

import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useCallback, memo } from "react";

// ========================================
// Types & Interfaces
// ========================================

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface NavItemsProps {
  items: Array<{
    name: string;
    link: string;
  }>;
  className?: string;
  onItemClick?: () => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

interface MobileNavToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

interface NavbarLogoProps {
  className?: string;
}

// ========================================
// Constants
// ========================================

const SCROLL_THRESHOLD = 50;

const NAVBAR_STYLES = {
  base: "mx-auto flex items-center justify-between rounded-full px-4 py-2 transition-all duration-[350ms] ease-out backdrop-blur-md",
  scrolled: "mt-4 w-[94%] sm:w-[90%] lg:w-[75%] bg-white/80 shadow-lg dark:bg-black/80",
  notScrolled: "mt-6 w-[98%] sm:w-[94%] lg:w-[85%] bg-white/60 dark:bg-black/60",
} as const;

// ========================================
// Hooks
// ========================================

const useScrollDetection = (threshold: number = SCROLL_THRESHOLD) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const shouldBeScrolled = window.scrollY > threshold;
      setIsScrolled(shouldBeScrolled);
    };

    handleScroll(); // Initial check
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return isScrolled;
};

// ========================================
// Main Components
// ========================================

export const Navbar = memo(({ children, className }: NavbarProps) => {
  const isScrolled = useScrollDetection();

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <nav
        className={cn(
          NAVBAR_STYLES.base,
          isScrolled ? NAVBAR_STYLES.scrolled : NAVBAR_STYLES.notScrolled,
          className
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {children}
      </nav>
    </header>
  );
});

Navbar.displayName = "Navbar";

export const NavBody = memo(({ children, className }: NavBodyProps) => {
  return (
    <div className={cn("hidden lg:flex items-center justify-between w-full", className)}>
      {children}
    </div>
  );
});

NavBody.displayName = "NavBody";

export const NavItems = memo(({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const handleMouseLeave = useCallback(() => setHovered(null), []);
  const handleMouseEnter = useCallback((idx: number) => setHovered(idx), []);

  return (
    <div
      onMouseLeave={handleMouseLeave}
      className={cn(
        "flex flex-1 flex-row items-center justify-center gap-2 text-sm font-medium",
        className
      )}
    >
      {items.map((item, idx) => (
        <a
          key={item.link}
          onMouseEnter={() => handleMouseEnter(idx)}
          onClick={onItemClick}
          className="relative px-4 py-2 rounded-full transition-colors hover:text-primary"
          href={item.link}
          aria-label={item.name}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 h-full w-full rounded-full bg-base-200 dark:bg-neutral-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
          <span className="relative z-10">{item.name}</span>
        </a>
      ))}
    </div>
  );
});

NavItems.displayName = "NavItems";

// ========================================
// Mobile Components
// ========================================

export const MobileNav = memo(({ children, className }: MobileNavProps) => {
  return (
    <div className={cn("flex lg:hidden items-center justify-between w-full", className)}>
      {children}
    </div>
  );
});

MobileNav.displayName = "MobileNav";

export const MobileNavHeader = memo(({ children, className }: MobileNavHeaderProps) => {
  return (
    <div className={cn("flex w-full flex-row items-center justify-between", className)}>
      {children}
    </div>
  );
});

MobileNavHeader.displayName = "MobileNavHeader";

export const MobileNavMenu = memo(({ children, className, isOpen, onClose }: MobileNavMenuProps) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "absolute inset-x-0 top-20 z-50 flex w-full flex-col items-start justify-start gap-4",
            "rounded-xl bg-base-100 px-6 py-6 backdrop-blur-sm dark:bg-neutral-950",
            "mx-[2%] sm:mx-[7.5%] lg:mx-[15%] shadow-lg",
            className
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

MobileNavMenu.displayName = "MobileNavMenu";

export const MobileNavToggle = memo(({ isOpen, onClick }: MobileNavToggleProps) => {
  return (
    <button
      onClick={onClick}
      className="p-2 -mr-2 text-current dark:text-white transition-colors hover:text-primary"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
    >
      {isOpen ? (
        <IconX className="w-6 h-6" aria-hidden="true" />
      ) : (
        <IconMenu2 className="w-6 h-6" aria-hidden="true" />
      )}
    </button>
  );
});

MobileNavToggle.displayName = "MobileNavToggle";

// ========================================
// Utility Components
// ========================================

export const NavbarLogo = memo(({ className }: NavbarLogoProps) => {
  return (
    <a
      href="/"
      className={cn(
        "relative z-20 flex items-center space-x-2 px-2 py-1 text-lg font-extrabold tracking-tight",
        "transition-colors hover:text-primary",
        className
      )}
      title="Home"
      aria-label="Go to homepage"
    >
      Template
    </a>
  );
});

NavbarLogo.displayName = "NavbarLogo";

export const NavbarButton = memo(({
  children,
  className,
  variant = "primary",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative z-20 px-4 py-2 rounded-lg font-medium transition-colors duration-200",
        variant === "primary"
          ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          : "bg-base-200 text-base-content hover:bg-base-300 dark:bg-neutral-800 dark:hover:bg-neutral-700",
        className
      )}
      type="button"
    >
      {children}
    </button>
  );
});

NavbarButton.displayName = "NavbarButton";
