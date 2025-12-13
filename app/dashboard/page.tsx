"use client";
import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import SidebarProfile from "@/components/SidebarProfile";
import {
  IconLayoutDashboard,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { createClient } from "@/libs/supabase/client";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const links = [
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
  ];

  return (
    <div className="flex h-screen w-full bg-base-100">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <Logo />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div className="border-t border-neutral-300 dark:border-neutral-700 pt-4 space-y-2">
            <SidebarProfile />
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-2 group/sidebar py-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition ${open ? 'justify-start px-3' : 'justify-center'}`}
            >
              <IconLogout className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
              <motion.span
                animate={{ opacity: open ? 1 : 0, display: open ? "inline-block" : "none" }}
                className="text-neutral-700 dark:text-neutral-200 text-sm whitespace-pre"
              >
                Logout
              </motion.span>
            </button>
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
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

const Logo = () => {
  return (
    <a
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black dark:text-white"
    >
      <div className="h-5 w-6 shrink-0 rounded-lg bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Template
      </motion.span>
    </a>
  );
};
