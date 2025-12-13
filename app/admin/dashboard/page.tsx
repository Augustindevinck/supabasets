"use client";

import { useState, useMemo, useEffect } from "react";
import { redirect } from "next/navigation";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import SidebarProfile from "@/components/SidebarProfile";
import SidebarLogo from "@/components/SidebarLogo";
import { IconLayoutDashboard, IconSettings, IconUsers } from "@tabler/icons-react";
import { createClient } from "@/libs/supabase/client";
import { isAdmin } from "@/libs/admin";

export default function AdminDashboard() {
  const [open, setOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [userCountLoading, setUserCountLoading] = useState(true);

  // Check if user is admin
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

  // Fetch user count
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch("/api/admin/users");
        const data = await response.json();
        setUserCount(data.users?.length || 0);
      } catch (error) {
        console.error("Error fetching user count:", error);
      } finally {
        setUserCountLoading(false);
      }
    };

    if (isAuthorized) {
      fetchUserCount();
    }
  }, [isAuthorized]);

  const links = useMemo(() => [
    {
      label: "Home",
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

  const adminLinks = useMemo(() => [
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
  ], []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full bg-base-100 items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex h-screen w-full bg-base-100">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <SidebarLogo href="/dashboard" />
            
            {/* User Links */}
            <nav className="mt-8 flex flex-col gap-2" aria-label="Main navigation">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </nav>

            {/* Admin Section Divider */}
            <div className="my-4 border-t border-neutral-300 dark:border-neutral-700"></div>

            {/* Admin Links */}
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
          </div>

          <div className="border-t border-neutral-300 dark:border-neutral-700 pt-4">
            <SidebarProfile />
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-base-200 bg-base-100">
          <div className="px-8 py-6">
            <h1 className="text-3xl md:text-4xl font-extrabold">Admin Dashboard</h1>
            <p className="text-base-content/60 mt-2">Vue d&apos;ensemble de votre SaaS</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <section className="p-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Total Users Card */}
                <div className="card bg-base-200 shadow-md">
                  <div className="card-body">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="card-title text-sm opacity-75">Total Utilisateurs</h2>
                        {userCountLoading ? (
                          <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                          <p className="text-4xl font-bold mt-4">{userCount}</p>
                        )}
                      </div>
                      <div className="bg-icon-theme-bg rounded-lg p-3">
                        <IconUsers className="h-8 w-8 icon-theme-text" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional stats can be added here */}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
