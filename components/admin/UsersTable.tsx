"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
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
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
  }, []);

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

  const formatDateShort = useCallback((dateString: string | null) => {
    if (!dateString) return "Jamais";
    try {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "Date invalide";
    }
  }, []);

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      const validDateA = isNaN(dateA) ? 0 : dateA;
      const validDateB = isNaN(dateB) ? 0 : dateB;
      return validDateB - validDateA;
    });
  }, [users]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (sortedUsers.length === 0) {
    return (
      <div className="text-center py-8 text-base-content/60">
        Aucun utilisateur trouvé
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Vue Desktop - Table */}
      <div className="hidden lg:block overflow-x-auto">
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
            {sortedUsers.map((user) => (
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Vue Tablette - Tableau compacte */}
      <div className="hidden md:block lg:hidden overflow-x-auto">
        <table className="table table-zebra w-full table-sm">
          <thead>
            <tr className="bg-base-200">
              <th className="p-2">Nom</th>
              <th className="p-2">Email</th>
              <th className="p-2">Inscrit</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr key={user.id} className="text-sm">
                <td className="font-medium p-2">{user.name}</td>
                <td className="p-2 text-xs break-all">{user.email}</td>
                <td className="p-2 text-xs">{formatDateShort(user.createdAt)}</td>
                <td className="p-2">
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Vue Mobile - Cartes */}
      <div className="md:hidden space-y-3">
        {sortedUsers.map((user) => (
          <div key={user.id} className="card bg-base-200 shadow-sm">
            <div className="card-body p-4 gap-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="card-title text-base font-semibold truncate">
                    {user.name}
                  </h3>
                  <p className="text-sm text-base-content/70 break-all">
                    {user.email}
                  </p>
                </div>
                <span className="badge badge-outline badge-xs ml-2 shrink-0">
                  {user.provider}
                </span>
              </div>

              <div className="divider divider-neutral my-0"></div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-base-content/60">Inscrit le</p>
                  <p className="font-medium">
                    {formatDateShort(user.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-base-content/60">Dernière connexion</p>
                  <p className="font-medium">
                    {formatDateShort(user.lastSignIn)}
                  </p>
                </div>
              </div>

              <button
                className="btn btn-error btn-sm w-full"
                onClick={() => handleDelete(user.id, user.email)}
                disabled={deletingId === user.id}
              >
                {deletingId === user.id ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Suppression...
                  </>
                ) : (
                  "Supprimer"
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Compteur total */}
      <div className="mt-6 pt-4 border-t border-base-300">
        <p className="text-sm text-base-content/60">
          Total: <span className="font-semibold text-base-content">
            {users.length}
          </span> utilisateur{users.length > 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}