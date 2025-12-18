"use client";

import { ReactNode, useMemo, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import {
  SidebarLayout,
  SidebarBody,
  SidebarLink,
  SidebarSection,
  SidebarDivider,
} from "@/components/ui/sidebar";
import SidebarProfile from "@/components/SidebarProfile";
import SidebarLogo from "@/components/SidebarLogo";
import { IconLayoutDashboard, IconUsers } from "@tabler/icons-react";
import { createClient } from "@/libs/supabase/client";
import { isAdmin } from "@/libs/admin";

interface AdminLayoutProps {
  children: ReactNode;
  pageTitle: string;
  pageSubtitle?: string;
}

export default function AdminLayout({ children, pageTitle, pageSubtitle }: AdminLayoutProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || !isAdmin(user.email)) {
        redirect("/dashboard");
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAdmin();
  }, []);

  const links = useMemo(
    () => [
      {
        label: "Home",
        href: "/dashboard",
        icon: (
          <IconLayoutDashboard className="h-5 w-5 shrink-0 text-gray-500" />
        ),
      },
    ],
    []
  );

  const adminLinks = useMemo(
    () => [
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
    ],
    []
  );

  if (isLoading) {
    return (
      <div className="flex h-screen w-full bg-gray-50 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-600" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  const sidebarContent = (
    <SidebarBody className="justify-between h-full">
      <div className="flex flex-col flex-1 min-h-0">
        <SidebarLogo href="/dashboard" logoText="Template" />

        <SidebarSection className="mt-6">
          {links.map((link) => (
            <SidebarLink key={link.href} link={link} />
          ))}
        </SidebarSection>

        <SidebarDivider />

        <SidebarSection title="Admin">
          {adminLinks.map((link) => (
            <SidebarLink key={link.href} link={link} />
          ))}
        </SidebarSection>
      </div>

      <SidebarProfile />
    </SidebarBody>
  );

  return (
    <SidebarLayout sidebar={sidebarContent} defaultExpanded={true}>
      <header className="sticky top-14 lg:top-0 z-30 border-b border-gray-200 bg-white">
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-5 lg:py-6">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
            {pageTitle}
          </h1>
          {pageSubtitle && (
            <p className="text-gray-500 mt-1 text-sm md:text-base">
              {pageSubtitle}
            </p>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </SidebarLayout>
  );
}
