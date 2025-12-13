import { redirect } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import { isAdmin } from "@/libs/admin";
import Link from "next/link";
import UsersTable from "@/components/admin/UsersTable";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-base-100">
      <header className="border-b border-base-200">
        <div className="max-w-6xl mx-auto px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">Admin Dashboard</h1>
            <p className="text-base-content/60 mt-2">Gestion de votre application</p>
          </div>
          <Link href="/dashboard" className="btn btn-ghost">
            Retour au Dashboard
          </Link>
        </div>
      </header>
      
      <section className="max-w-6xl mx-auto px-8 py-12">
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
      </section>
    </main>
  );
}
