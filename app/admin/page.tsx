"use client";

import { useState } from "react";
import UsersTable from "@/components/admin/UsersTable";
import SubscriptionStats from "@/components/admin/SubscriptionStats";
import AdminLayout from "@/components/AdminLayout";

interface Stats {
  total: number;
  subscribed: number;
  nonSubscribed: number;
  conversionRate: string;
}

export default function AdminUsers() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleStatsLoaded = (loadedStats: Stats | null) => {
    setStats(loadedStats);
    setIsLoading(false);
  };

  return (
    <AdminLayout pageTitle="Admin Dashboard" pageSubtitle="Gestion de votre application">
      <section className="p-8">
        <div className="max-w-6xl mx-auto">
          <SubscriptionStats stats={stats} isLoading={isLoading} />

          <div className="card bg-base-200">
            <div className="card-body">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="card-title text-2xl">Utilisateurs</h2>
                  <p className="text-base-content/60">Liste de tous les utilisateurs inscrits</p>
                </div>
              </div>
              
              <UsersTable onStatsLoaded={handleStatsLoaded} />
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
