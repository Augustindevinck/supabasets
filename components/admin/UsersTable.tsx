"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import toast from "react-hot-toast";

// Assuming User interface is defined elsewhere or needs to be included
// For now, I'll define it here based on the original code's usage
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

  const fetchUsers = useCallback(async () => {
    setIsLoading(true); // Set loading true at the start of fetch
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setUsers(data.users);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors du chargement des utilisateurs");
    } finally {
      setIsLoading(false);
    }
  }, []); // fetchUsers doesn't depend on external state that changes

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // Depend on fetchUsers

  const handleDelete = useCallback(async (userId: string, email: string) => {
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success("Utilisateur supprimé");
      setUsers(prevUsers => prevUsers.filter((u) => u.id !== userId));
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  }, []); // handleDelete doesn't depend on external state that changes

  // Memoize the formatting function
  const formatDate = useCallback((dateString: string | null) => {
    if (!dateString) return "Jamais";
    try {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "Date invalide";
    }
  }, []);

  // Memoize the sorted users based on createdAt
  // Assuming the backend provides createdAt, if not, adjust accordingly
  // Using `created_at` from supabase is common, adjust if your backend uses `createdAt`
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      // Safely access dates, default to 0 if null/undefined or invalid
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      // Handle potential NaN from invalid dates
      const validDateA = isNaN(dateA) ? 0 : dateA;
      const validDateB = isNaN(dateB) ? 0 : dateB;
      return validDateB - validDateA; // Descending order
    });
  }, [users]);


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
          {sortedUsers.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-8 text-base-content/60">
                Aucun utilisateur trouvé
              </td>
            </tr>
          ) : (
            sortedUsers.map((user) => (
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