"use client";

import { cn } from "@/lib/utils";
import React, {
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";

const SIDEBAR_WIDTH_EXPANDED = 220;
const SIDEBAR_WIDTH_COLLAPSED = 64;
const TRANSITION_DURATION = 0.2;

interface SidebarLinkData {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarContextProps {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileOpen: boolean;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAnimating: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = (): SidebarContextProps => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function SidebarProvider({
  children,
  defaultExpanded = true,
}: SidebarProviderProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen]);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), TRANSITION_DURATION * 1000);
    return () => clearTimeout(timer);
  }, [isExpanded]);

  const value = useMemo(
    () => ({
      isExpanded,
      setIsExpanded,
      isMobileOpen,
      setIsMobileOpen,
      isAnimating,
    }),
    [isExpanded, isMobileOpen, isAnimating]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

interface SidebarLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  defaultExpanded?: boolean;
}

export function SidebarLayout({ children, sidebar, defaultExpanded = true }: SidebarLayoutProps) {
  return (
    <SidebarProvider defaultExpanded={defaultExpanded}>
      <div className="flex min-h-screen w-full bg-gray-50">
        <DesktopSidebar>{sidebar}</DesktopSidebar>
        <MobileSidebar>{sidebar}</MobileSidebar>
        <SidebarMainContent>{children}</SidebarMainContent>
      </div>
    </SidebarProvider>
  );
}

function SidebarMainContent({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useSidebar();

  return (
    <div
      className={cn(
        "flex-1 flex flex-col min-h-screen w-full",
        "pt-14 lg:pt-0",
        "ml-0",
        "lg:transition-[margin-left] lg:duration-200 lg:ease-in-out",
        isExpanded ? "lg:ml-[220px]" : "lg:ml-[64px]"
      )}
    >
      {children}
    </div>
  );
}

interface SidebarProps {
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function Sidebar({ children, defaultExpanded = true }: SidebarProps) {
  return (
    <SidebarProvider defaultExpanded={defaultExpanded}>
      <DesktopSidebar>{children}</DesktopSidebar>
      <MobileSidebar>{children}</MobileSidebar>
    </SidebarProvider>
  );
}

interface SidebarBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarBody({ children, className }: SidebarBodyProps) {
  return (
    <div className={cn("flex h-full flex-col", className)}>
      {children}
    </div>
  );
}

function DesktopSidebar({ children }: { children: React.ReactNode }) {
  const { isExpanded, setIsExpanded } = useSidebar();

  const toggleSidebar = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, [setIsExpanded]);

  return (
    <motion.aside
      data-sidebar="desktop"
      className={cn(
        "hidden lg:flex flex-col",
        "fixed left-0 top-0 h-screen z-40",
        "bg-white border-r border-gray-200",
        "shadow-sm"
      )}
      initial={false}
      animate={{
        width: isExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED,
      }}
      transition={{
        duration: TRANSITION_DURATION,
        ease: "easeInOut",
      }}
      role="navigation"
      aria-label="Sidebar navigation"
    >
      <div className="flex h-full flex-col overflow-hidden">
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="px-3 py-4">
            {children}
          </div>
        </div>

        <div className="shrink-0 border-t border-gray-200 p-2">
          <button
            onClick={toggleSidebar}
            className={cn(
              "flex items-center justify-center w-full",
              "h-10 rounded-lg",
              "text-gray-500 hover:text-gray-700",
              "hover:bg-gray-100",
              "transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            )}
            aria-label={isExpanded ? "Réduire la sidebar" : "Ouvrir la sidebar"}
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <IconChevronLeft className="h-5 w-5" />
            ) : (
              <IconChevronRight className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </motion.aside>
  );
}

function MobileHeader() {
  const { setIsMobileOpen } = useSidebar();

  const openSidebar = useCallback(() => {
    setIsMobileOpen(true);
  }, [setIsMobileOpen]);

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 h-14 flex items-center">
      <button
        onClick={openSidebar}
        className={cn(
          "p-2 -ml-2 rounded-lg",
          "text-gray-600 hover:text-gray-900",
          "hover:bg-gray-100",
          "transition-colors duration-150",
          "focus:outline-none focus:ring-2 focus:ring-blue-500"
        )}
        aria-label="Ouvrir le menu"
      >
        <IconMenu2 className="h-6 w-6" />
      </button>
    </div>
  );
}

function MobileSidebar({ children }: { children: React.ReactNode }) {
  const { isMobileOpen, setIsMobileOpen } = useSidebar();

  const closeSidebar = useCallback(() => {
    setIsMobileOpen(false);
  }, [setIsMobileOpen]);

  return (
    <>
      <MobileHeader />

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-40 bg-black"
              onClick={closeSidebar}
              aria-hidden="true"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={cn(
                "lg:hidden fixed left-0 top-0 z-50",
                "w-[280px] max-w-[85vw] h-screen",
                "bg-white shadow-xl",
                "flex flex-col"
              )}
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navigation"
            >
              <div className="shrink-0 flex items-center justify-between px-4 h-14 border-b border-gray-200">
                <span className="font-semibold text-gray-900">Menu</span>
                <button
                  onClick={closeSidebar}
                  className={cn(
                    "p-2 -mr-2 rounded-lg",
                    "text-gray-500 hover:text-gray-700",
                    "hover:bg-gray-100",
                    "transition-colors duration-150",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500"
                  )}
                  aria-label="Fermer le menu"
                >
                  <IconX className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
                <div className="px-3 py-4">
                  {children}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

interface SidebarLinkProps {
  link: SidebarLinkData;
  className?: string;
}

export function SidebarLink({ link, className }: SidebarLinkProps) {
  const { isExpanded, setIsMobileOpen, isAnimating } = useSidebar();

  const handleClick = useCallback(() => {
    setIsMobileOpen(false);
  }, [setIsMobileOpen]);

  return (
    <Link
      href={link.href}
      onClick={handleClick}
      className={cn(
        "flex items-center gap-3",
        "py-2.5 rounded-lg",
        "text-gray-600 hover:text-gray-900",
        "hover:bg-gray-100",
        "transition-colors duration-150",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
        isExpanded ? "px-3 justify-start" : "px-0 justify-center",
        className
      )}
      aria-label={link.label}
    >
      <span className="shrink-0" aria-hidden="true">
        {link.icon}
      </span>
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
        className={cn(
          "text-sm font-medium whitespace-nowrap overflow-hidden",
          isAnimating && "pointer-events-none"
        )}
      >
        {link.label}
      </motion.span>
    </Link>
  );
}

interface SidebarSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function SidebarSection({ title, children, className }: SidebarSectionProps) {
  const { isExpanded } = useSidebar();

  return (
    <div className={cn("py-2", className)}>
      {title && (
        <motion.p
          initial={false}
          animate={{
            opacity: isExpanded ? 1 : 0,
            height: isExpanded ? "auto" : 0,
          }}
          transition={{ duration: TRANSITION_DURATION }}
          className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 overflow-hidden"
        >
          {title}
        </motion.p>
      )}
      <nav className="flex flex-col gap-1" role="navigation">
        {children}
      </nav>
    </div>
  );
}

interface SidebarDividerProps {
  className?: string;
}

export function SidebarDivider({ className }: SidebarDividerProps) {
  return (
    <div
      className={cn("my-2 border-t border-gray-200", className)}
      role="separator"
    />
  );
}

export { type SidebarLinkData as SidebarLinkType };
export { SIDEBAR_WIDTH_EXPANDED, SIDEBAR_WIDTH_COLLAPSED };
