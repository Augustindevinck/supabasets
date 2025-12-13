"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  lastSignIn: string | null;
  provider: string;
}

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      
      if (data.error) {
        toast.error(data.error);
        return;
      }
      
      setUsers(data.users);
    } catch (error) {
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: string, email: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${email} ?`)) {
      return;
    }

    setDeletingId(userId);
    
    try {
      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        toast.error(data.error);
        return;
      }
      
      toast.success("Utilisateur supprimé");
      setUsers(users.filter((u) => u.id !== userId));
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Jamais";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr className="bg-base-200">
            <th>Nom</th>
            <th>Email</th>
            <th>Provider</th>
            <th>Inscrit le</th>
            <th>Dernière connexion</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-8 text-base-content/60">
                Aucun utilisateur trouvé
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td className="font-medium">{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className="badge badge-outline badge-sm">
                    {user.provider}
                  </span>
                </td>
                <td className="text-sm">{formatDate(user.createdAt)}</td>
                <td className="text-sm">{formatDate(user.lastSignIn)}</td>
                <td>
                  <button
                    className="btn btn-error btn-xs"
                    onClick={() => handleDelete(user.id, user.email)}
                    disabled={deletingId === user.id}
                  >
                    {deletingId === user.id ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      "Supprimer"
                    )}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      
      <div className="mt-4 text-sm text-base-content/60">
        Total: {users.length} utilisateur{users.length > 1 ? "s" : ""}
      </div>
    </div>
  );
}
