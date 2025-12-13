"use client";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/libs/supabase/client";
import { useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";

export default function SidebarProfile() {
  const [user, setUser] = useState<User>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { open } = useSidebar();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-2 group/sidebar py-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition ${open ? 'px-3' : 'justify-center'}`}
      >
        {user?.user_metadata?.avatar_url ? (
          <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden">
            <img
              src={user?.user_metadata?.avatar_url}
              alt={"Profile picture"}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              width={32}
              height={32}
            />
          </div>
        ) : (
          <span className="w-8 h-8 bg-base-100 flex justify-center items-center rounded-full shrink-0 capitalize text-sm font-bold">
            {user?.email?.charAt(0)}
          </span>
        )}
        {open && (
          <span className="text-neutral-700 dark:text-neutral-200 text-sm whitespace-pre">
            {user?.user_metadata?.name || user?.email?.split("@")[0] || "Account"}
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
