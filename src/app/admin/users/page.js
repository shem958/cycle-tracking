"use client";
import { useState, useEffect } from "react";
import { useAppContext } from "@/app/context/AppContext";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function AdminUsersPage() {
  const { token } = useAppContext();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        } else {
          setError("Failed to fetch users");
        }
      } catch {
        setError("Something went wrong");
      }
    };
    if (token) fetchUsers();
  }, [token]);

  const handleSuspend = async (userId) => {
    if (!confirm("Are you sure you want to suspend this user?")) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/admin/users/${userId}/suspend`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        setUsers(
          users.map((u) => (u.id === userId ? { ...u, suspended: true } : u))
        );
      } else {
        setError("Failed to suspend user");
      }
    } catch {
      setError("Something went wrong");
    }
  };

  const handleUnsuspend = async (userId) => {
    if (!confirm("Are you sure you want to unsuspend this user?")) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/admin/users/${userId}/unsuspend`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        setUsers(
          users.map((u) => (u.id === userId ? { ...u, suspended: false } : u))
        );
      } else {
        setError("Failed to unsuspend user");
      }
    } catch {
      setError("Something went wrong");
    }
  };

  const handleBan = async (userId) => {
    if (!confirm("Are you sure you want to ban this user?")) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/admin/users/${userId}/ban`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        setUsers(
          users.map((u) => (u.id === userId ? { ...u, banned: true } : u))
        );
      } else {
        setError("Failed to ban user");
      }
    } catch {
      setError("Something went wrong");
    }
  };

  const handleUnban = async (userId) => {
    if (!confirm("Are you sure you want to unban this user?")) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/admin/users/${userId}/unban`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        setUsers(
          users.map((u) => (u.id === userId ? { ...u, banned: false } : u))
        );
      } else {
        setError("Failed to unban user");
      }
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Admin: User Management</h1>
        <div className="bg-background p-6 rounded-lg shadow-md">
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <ul className="space-y-4">
            {users.map((user) => (
              <li
                key={user.id}
                className="bg-white dark:bg-[#2A3441] rounded-xl p-4 shadow flex justify-between items-center"
              >
                <div>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {user.username}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Role: {user.role} | Status:{" "}
                    {user.suspended ? "Suspended" : "Active"} | Ban:{" "}
                    {user.banned ? "Banned" : "Active"}
                  </p>
                </div>
                <div className="flex gap-3">
                  {user.suspended ? (
                    <button
                      onClick={() => handleUnsuspend(user.id)}
                      className="text-green-500 hover:text-green-700 text-sm"
                    >
                      Unsuspend
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSuspend(user.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Suspend
                    </button>
                  )}
                  {user.banned ? (
                    <button
                      onClick={() => handleUnban(user.id)}
                      className="text-green-500 hover:text-green-700 text-sm"
                    >
                      Unban
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBan(user.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Ban
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
}
