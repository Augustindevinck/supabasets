
"use client";
import { useState, useEffect, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/libs/supabase/client";
import { useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";

export default function SidebarProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { open } = useSidebar();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        
        if (error) {
          console.error("Error fetching user:", error);
          return;
        }
        
        setUser(user);
      } catch (error) {
        console.error("Unexpected error fetching user:", error);
      }
    };
    
    getUser();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!user) return null;

  const displayName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Account";
  const avatarInitial = user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-2 group/sidebar py-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition ${open ? 'px-3' : 'justify-center'}`}
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        {user?.user_metadata?.avatar_url ? (
          <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden">
            <img
              src={user.user_metadata.avatar_url}
              alt="Profile picture"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              width={32}
              height={32}
            />
          </div>
        ) : (
          <span className="w-8 h-8 bg-base-100 flex justify-center items-center rounded-full shrink-0 capitalize text-sm font-bold">
            {avatarInitial}
          </span>
        )}
        {open && (
          <span className="text-neutral-700 dark:text-neutral-200 text-sm whitespace-pre">
            {displayName}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 w-48 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg mb-2 z-50">
          <Link
            href="/dashboard/settings"
            className="block w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-sm text-neutral-700 dark:text-neutral-200 rounded-t-lg"
            onClick={() => setIsOpen(false)}
          >
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-sm text-neutral-700 dark:text-neutral-200 rounded-b-lg border-t border-neutral-200 dark:border-neutral-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
