"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/libs/supabase/client";
import { SidebarLink } from "@/components/ui/sidebar";
import { IconUsers, IconLayoutDashboard } from "@tabler/icons-react";
import { ADMIN_EMAILS } from "@/libs/admin";

export default function AdminLinks({ open }: { open: boolean }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [supabase]);

  if (isLoading || !isAdmin) {
    return null;
  }

  const adminLinks = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: (
        <IconLayoutDashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Utilisateurs",
      href: "/admin",
      icon: (
        <IconUsers className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  return (
    <>
      <div className="my-4 border-t border-neutral-300 dark:border-neutral-700"></div>
      <div className="flex flex-col gap-2">
        <p className={`text-xs font-semibold text-neutral-600 dark:text-neutral-400 ${open ? "px-3" : "text-center"}`}>
          ADMIN
        </p>
        <nav className="flex flex-col gap-2" aria-label="Admin navigation">
          {adminLinks.map((link, idx) => (
            <SidebarLink key={idx} link={link} />
          ))}
        </nav>
      </div>
    </>
  );
}
