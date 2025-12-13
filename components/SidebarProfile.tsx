
"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/libs/supabase/client";
import { useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";

const MENU_ITEMS = [
  { label: "Settings", href: "/dashboard/settings" },
  { label: "Logout", action: "logout" as const },
] as const;

export default function SidebarProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { open } = useSidebar();
  const supabase = useMemo(() => createClient(), []);

  // Fetch user data
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

  // Close dropdown when clicking outside
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

  // Close dropdown on Escape key
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

  const toggleDropdown = useCallback(() => setIsOpen(prev => !prev), []);
  
  const closeDropdown = useCallback(() => setIsOpen(false), []);

  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, [supabase]);

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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={cn(
          "w-full flex items-center gap-2 group/sidebar py-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-150",
          open ? "justify-start px-3" : "justify-center"
        )}
        aria-label="User menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {user.user_metadata?.avatar_url ? (
          <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden">
            <img
              src={user.user_metadata.avatar_url}
              alt={`${displayName}'s profile picture`}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              width={32}
              height={32}
            />
          </div>
        ) : (
          <span 
            className="w-8 h-8 bg-base-100 flex justify-center items-center rounded-full shrink-0 capitalize text-sm font-bold"
            aria-hidden="true"
          >
            {avatarInitial}
          </span>
        )}
        {open && (
          <span className="text-neutral-700 dark:text-neutral-200 text-sm whitespace-pre truncate">
            {displayName}
          </span>
        )}
      </button>

      {isOpen && (
        <nav
          className="absolute bottom-full left-0 w-48 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg mb-2 z-50"
          role="menu"
          aria-label="User menu"
        >
          {MENU_ITEMS.map((item, index) => {
            const isLast = index === MENU_ITEMS.length - 1;
            
            if (item.action === "logout") {
              return (
                <button
                  key={item.label}
                  onClick={handleLogout}
                  className={cn(
                    "block w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-sm text-neutral-700 dark:text-neutral-200",
                    isLast ? "rounded-b-lg border-t border-neutral-200 dark:border-neutral-700" : ""
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
                href={item.href}
                className={cn(
                  "block w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-sm text-neutral-700 dark:text-neutral-200",
                  index === 0 ? "rounded-t-lg" : ""
                )}
                onClick={closeDropdown}
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

// Utility function for className concatenation
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
