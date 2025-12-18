"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/libs/supabase/client";
import { SidebarLink, SidebarSection, SidebarDivider } from "@/components/ui/sidebar";
import { IconUsers, IconLayoutDashboard } from "@tabler/icons-react";
import { ADMIN_EMAILS } from "@/libs/admin";

export default function AdminLinks() {
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
        <IconLayoutDashboard className="h-5 w-5 shrink-0 text-gray-500" />
      ),
    },
    {
      label: "Utilisateurs",
      href: "/admin",
      icon: (
        <IconUsers className="h-5 w-5 shrink-0 text-gray-500" />
      ),
    },
  ];

  return (
    <>
      <SidebarDivider />
      <SidebarSection title="Admin">
        {adminLinks.map((link) => (
          <SidebarLink key={link.href} link={link} />
        ))}
      </SidebarSection>
    </>
  );
}
