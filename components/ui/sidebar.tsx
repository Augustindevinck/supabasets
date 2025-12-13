
"use client";
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
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
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}

export const SidebarProvider = React.memo(({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: SidebarProviderProps) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  const value = useMemo(() => ({ open, setOpen, animate }), [open, setOpen, animate]);

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
});

SidebarProvider.displayName = "SidebarProvider";

interface SidebarProps {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}

export const Sidebar = React.memo(({
  children,
  open,
  setOpen,
  animate,
}: SidebarProps) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
});

Sidebar.displayName = "Sidebar";

export const SidebarBody = React.memo((props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as unknown as React.ComponentProps<"div">)} />
    </>
  );
});

SidebarBody.displayName = "SidebarBody";

export const DesktopSidebar = React.memo(({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();

  const handleMouseEnter = useCallback(() => setOpen(true), [setOpen]);
  const handleMouseLeave = useCallback(() => setOpen(false), [setOpen]);

  return (
    <motion.aside
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 w-[300px] shrink-0",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "60px") : "300px",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="complementary"
      aria-label="Navigation sidebar"
      {...props}
    >
      {children}
    </motion.aside>
  );
});

DesktopSidebar.displayName = "DesktopSidebar";

export const MobileSidebar = React.memo(({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();

  const toggleSidebar = useCallback(() => setOpen(prev => !prev), [setOpen]);

  return (
    <>
      <div
        className="h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full"
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <button
            onClick={toggleSidebar}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="text-neutral-800 dark:text-neutral-200 p-1"
          >
            <IconMenu2 />
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
                className
              )}
              role="dialog"
              aria-label="Mobile navigation"
            >
              <button
                className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200 p-1"
                onClick={toggleSidebar}
                aria-label="Close menu"
              >
                <IconX />
              </button>
              {children}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </>
  );
});

MobileSidebar.displayName = "MobileSidebar";

interface SidebarLinkProps {
  link: Links;
  className?: string;
}

/**
 * SidebarLink component - Individual navigation link with icon and label
 * Automatically collapses mobile menu on click
 */
export const SidebarLink = React.memo(({
  link,
  className,
  ...props
}: SidebarLinkProps & Omit<React.ComponentProps<"a">, keyof SidebarLinkProps>) => {
  const { open, animate, setOpen } = useSidebar();
  
  const handleClick = useCallback(() => {
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  }, [setOpen]);
  
  return (
    <a
      href={link.href}
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 group/sidebar py-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-150",
        open ? "justify-start px-3" : "justify-center",
        className
      )}
      aria-label={link.label}
      {...props}
    >
      <span className="shrink-0" aria-hidden="true">
        {link.icon}
      </span>

      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </a>
  );
});

SidebarLink.displayName = "SidebarLink";
