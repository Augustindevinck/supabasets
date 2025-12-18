"use client";

import { ReactNode, useMemo } from "react";
import {
  SidebarLayout,
  SidebarBody,
  SidebarLink,
  SidebarSection,
} from "@/components/ui/sidebar";
import SidebarProfile from "@/components/SidebarProfile";
import SidebarLogo from "@/components/SidebarLogo";
import AdminLinks from "@/components/AdminLinks";
import { IconLayoutDashboard } from "@tabler/icons-react";

interface DashboardLayoutProps {
  children: ReactNode;
  pageTitle: string;
}

export default function DashboardLayout({ children, pageTitle }: DashboardLayoutProps) {
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

  const sidebarContent = (
    <SidebarBody className="justify-between h-full">
      <div className="flex flex-col flex-1 min-h-0">
        <SidebarLogo href="/dashboard" logoText="Template" />

        <SidebarSection className="mt-6">
          {links.map((link) => (
            <SidebarLink key={link.href} link={link} />
          ))}
        </SidebarSection>

        <AdminLinks />
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
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </SidebarLayout>
  );
}
