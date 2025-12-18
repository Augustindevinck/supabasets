"use client";

import { useState, useEffect, useMemo } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/libs/supabase/client";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/DashboardLayout";

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = useMemo(() => createClient(), []);

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
      <DashboardLayout pageTitle="Settings">
        <div className="flex items-center justify-center h-full">
          <span className="loading loading-lg"></span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Settings">
      <section className="p-8 flex justify-center">
            <div className="max-w-2xl w-full space-y-6">
              {/* Profile Section */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-6">Profil</h2>
                  
                  <form onSubmit={handleSaveName} className="space-y-4">
                    <div className="w-full">
                      <label className="block py-1">
                        <span className="text-sm font-medium">Email</span>
                      </label>
                      <input
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="input w-full bg-base-100"
                      />
                      <label className="block py-1">
                        <span className="text-xs text-base-content/50">Adresse email du compte</span>
                      </label>
                    </div>

                    <div className="w-full">
                      <label className="block py-1">
                        <span className="text-sm font-medium">Nom</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Votre nom"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input w-full"
                      />
                      <label className="block py-1">
                        <span className="text-xs text-base-content/50">Comment vous êtes identifié dans l'app</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="btn btn-primary w-full"
                    >
                      {isSaving ? (
                        <span className="loading loading-sm"></span>
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
                    
                    <label className="block py-1">
                      <span className="text-xs text-base-content/50">Un lien de réinitialisation sera envoyé à votre email</span>
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
                  
                  <label className="block py-1">
                    <span className="text-xs text-error/70">Cette action ne peut pas être annulée</span>
                  </label>
                </div>
              </div>
            </div>
          </section>
    </DashboardLayout>
  );
}
