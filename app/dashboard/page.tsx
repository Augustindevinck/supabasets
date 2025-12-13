
"use client";
import { useState, useMemo } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import SidebarProfile from "@/components/SidebarProfile";
import SidebarLogo from "@/components/SidebarLogo";
import { IconLayoutDashboard, IconSettings } from "@tabler/icons-react";
import AdminLinks from "@/components/AdminLinks";

export default function Dashboard() {
  const [open, setOpen] = useState(false);

  const links = useMemo(() => [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconLayoutDashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ], []);

  return (
    <div className="flex h-screen w-full bg-base-100">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <SidebarLogo />
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
        <header className="border-b border-base-200 bg-base-100">
          <div className="px-8 py-6">
            <h1 className="text-3xl md:text-4xl font-extrabold">Dashboard</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <section className="p-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Dashboard content */}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
