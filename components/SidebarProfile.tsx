"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/libs/supabase/client";
import { useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const MENU_ITEMS = [
  { label: "Settings", href: "/dashboard/settings" },
  { label: "Logout", action: "logout" as const },
] as const;

const TRANSITION_DURATION = 0.2;

export default function SidebarProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isExpanded, setIsMobileOpen } = useSidebar();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let isMounted = true;

    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (error) {
          console.error("Error fetching user:", error);
          return;
        }

        setUser(user);
      } catch (error) {
        if (isMounted) {
          console.error("Unexpected error fetching user:", error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    getUser();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  const toggleDropdown = useCallback(() => setIsOpen((prev) => !prev), []);

  const closeDropdown = useCallback(() => setIsOpen(false), []);

  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, [supabase]);

  const handleMenuClick = useCallback(() => {
    closeDropdown();
    setIsMobileOpen(false);
  }, [closeDropdown, setIsMobileOpen]);

  const displayName = useMemo(
    () => user?.user_metadata?.name || user?.email?.split("@")[0] || "Account",
    [user]
  );

  const avatarInitial = useMemo(
    () => user?.email?.charAt(0).toUpperCase() || "U",
    [user]
  );

  if (isLoading || !user) return null;

  return (
    <div className="relative border-t border-gray-200 pt-3" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={cn(
          "w-full flex items-center gap-3",
          "py-2.5 rounded-lg",
          "text-gray-600 hover:text-gray-900",
          "hover:bg-gray-100",
          "transition-colors duration-150",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
          isExpanded ? "px-3 justify-start" : "px-0 justify-center"
        )}
        aria-label="Menu utilisateur"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {user.user_metadata?.avatar_url ? (
          <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden">
            <img
              src={user.user_metadata.avatar_url}
              alt={`Photo de profil de ${displayName}`}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              width={32}
              height={32}
            />
          </div>
        ) : (
          <span
            className="w-8 h-8 bg-gray-200 flex justify-center items-center rounded-full shrink-0 capitalize text-sm font-semibold text-gray-700"
            aria-hidden="true"
          >
            {avatarInitial}
          </span>
        )}
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
          className="text-sm font-medium whitespace-nowrap overflow-hidden truncate max-w-[140px]"
        >
          {displayName}
        </motion.span>
      </button>

      {isOpen && (
        <nav
          className="absolute bottom-full left-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg mb-2 z-50"
          role="menu"
          aria-label="Menu utilisateur"
        >
          {MENU_ITEMS.map((item, index) => {
            const isLast = index === MENU_ITEMS.length - 1;

            if ("action" in item && item.action === "logout") {
              return (
                <button
                  key={item.label}
                  onClick={handleLogout}
                  className={cn(
                    "block w-full text-left px-4 py-2.5 text-sm text-gray-700",
                    "hover:bg-gray-50 hover:text-gray-900",
                    "transition-colors duration-150",
                    "focus:outline-none focus:bg-gray-50",
                    isLast && "rounded-b-lg border-t border-gray-100"
                  )}
                  role="menuitem"
                >
                  {item.label}
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                href={"href" in item ? item.href : "/"}
                className={cn(
                  "block w-full text-left px-4 py-2.5 text-sm text-gray-700",
                  "hover:bg-gray-50 hover:text-gray-900",
                  "transition-colors duration-150",
                  "focus:outline-none focus:bg-gray-50",
                  index === 0 && "rounded-t-lg"
                )}
                onClick={handleMenuClick}
                role="menuitem"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
