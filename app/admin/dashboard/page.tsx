"use client";

import { useState, useEffect } from "react";
import { IconUsers } from "@tabler/icons-react";
import AdminLayout from "@/components/AdminLayout";

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState(0);
  const [userCountLoading, setUserCountLoading] = useState(true);

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

    fetchUserCount();
  }, []);

  return (
    <AdminLayout pageTitle="Admin Dashboard" pageSubtitle="Vue d'ensemble de votre SaaS">
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
    </AdminLayout>
  );
}
