"use client";

import { ReactNode, useState, useMemo } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import SidebarProfile from "@/components/SidebarProfile";
import SidebarLogo from "@/components/SidebarLogo";
import { IconLayoutDashboard } from "@tabler/icons-react";
import AdminLinks from "@/components/AdminLinks";

interface DashboardLayoutProps {
  children: ReactNode;
  pageTitle: string;
}

export default function DashboardLayout({ children, pageTitle }: DashboardLayoutProps) {
  const [open, setOpen] = useState(false);

  const links = useMemo(() => [
    {
      label: "Home",
      href: "/dashboard",
      icon: (
        <IconLayoutDashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ], []);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-base-100">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <SidebarLogo href="/dashboard" />
            <nav className="mt-8 flex flex-col gap-2" aria-label="Main navigation">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </nav>
            
            <AdminLinks open={open} />
          </div>
          <div className="border-t border-neutral-300 dark:border-neutral-700 pt-4">
            <SidebarProfile />
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-40 border-b border-base-200 bg-base-100">
          <div className="px-4 md:px-8 py-4 md:py-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold">{pageTitle}</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
