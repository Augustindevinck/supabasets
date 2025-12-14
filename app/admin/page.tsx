"use client";

import UsersTable from "@/components/admin/UsersTable";
import AdminLayout from "@/components/AdminLayout";

export default function AdminUsers() {
  return (
    <AdminLayout pageTitle="Admin Dashboard" pageSubtitle="Gestion de votre application">
      <section className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="card bg-base-200">
            <div className="card-body">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="card-title text-2xl">Utilisateurs</h2>
                  <p className="text-base-content/60">Liste de tous les utilisateurs inscrits</p>
                </div>
              </div>
              
              <UsersTable />
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
