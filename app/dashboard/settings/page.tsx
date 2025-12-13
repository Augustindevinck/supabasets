"use client";

import { useState, useEffect, useMemo } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/libs/supabase/client";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import SidebarProfile from "@/components/SidebarProfile";
import SidebarLogo from "@/components/SidebarLogo";
import { IconLayoutDashboard, IconSettings } from "@tabler/icons-react";
import toast from "react-hot-toast";
import AdminLinks from "@/components/AdminLinks";

export default function Settings() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = useMemo(() => createClient(), []);

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

  // Fetch user data
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setName(user.user_metadata?.name || "");
      }
      setIsLoading(false);
    };
    getUser();
  }, [supabase]);

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Le nom ne peut pas être vide");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { name: name.trim() },
      });

      if (error) {
        toast.error("Erreur lors de la sauvegarde");
      } else {
        toast.success("Nom mis à jour avec succès !");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user?.email) return;
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email);
      if (error) {
        toast.error("Erreur lors de l'envoi du lien");
      } else {
        toast.success("Lien de réinitialisation envoyé à votre email");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full bg-base-100 items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-base-100">
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
        <header className="border-b border-base-200 bg-base-100">
          <div className="px-8 py-6">
            <h1 className="text-3xl md:text-4xl font-extrabold">Settings</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <section className="p-8 flex justify-center">
            <div className="max-w-2xl w-full space-y-6">
              {/* Profile Section */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-6">Profil</h2>
                  
                  <form onSubmit={handleSaveName} className="space-y-4">
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-medium">Email</span>
                      </label>
                      <input
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="input input-bordered w-full bg-base-100"
                      />
                      <label className="label">
                        <span className="label-text-alt text-base-content/50">Adresse email du compte</span>
                      </label>
                    </div>

                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-medium">Nom</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Votre nom"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input input-bordered w-full"
                      />
                      <label className="label">
                        <span className="label-text-alt text-base-content/50">Comment vous êtes identifié dans l'app</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="btn btn-primary w-full"
                    >
                      {isSaving ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        "Sauvegarder"
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Security Section */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-6">Sécurité</h2>
                  
                  <div className="space-y-3">
                    <p className="text-sm text-base-content/70">
                      Gérez votre mot de passe et les paramètres de sécurité de votre compte.
                    </p>
                    
                    <button
                      onClick={handleChangePassword}
                      className="btn btn-outline w-full"
                    >
                      Changer le mot de passe
                    </button>
                    
                    <label className="label">
                      <span className="label-text-alt text-base-content/50">Un lien de réinitialisation sera envoyé à votre email</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="card bg-error/10 border-2 border-error/20">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-6 text-error">Zone de danger</h2>
                  
                  <button
                    className="btn btn-error w-full"
                    onClick={() => {
                      if (confirm("Êtes-vous sûr ? Cette action est irréversible.")) {
                        toast.error("Suppression de compte à implémenter");
                      }
                    }}
                  >
                    Supprimer mon compte
                  </button>
                  
                  <label className="label">
                    <span className="label-text-alt text-error/70">Cette action ne peut pas être annulée</span>
                  </label>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
