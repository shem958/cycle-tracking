"use client";
import { useState, useEffect } from "react";
import { useAppContext } from "@/app/context/AppContext";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Link from "next/link";

export default function UsersPage() {
  const { token, user } = useAppContext();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/users?search=${search}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
  }, [token, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleBlock = async (userId) => {
    if (!confirm("Are you sure you want to block this user?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/block`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, targetId: userId }),
      });
      if (res.ok) {
        setUsers(
          users.map((u) => (u.id === userId ? { ...u, blocked: true } : u))
        );
      } else {
        setError("Failed to block user");
      }
    } catch {
      setError("Something went wrong");
    }
  };

  const handleUnblock = async (userId) => {
    if (!confirm("Are you sure you want to unblock this user?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/unblock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, targetId: userId }),
      });
      if (res.ok) {
        setUsers(
          users.map((u) => (u.id === userId ? { ...u, blocked: false } : u))
        );
      } else {
        setError("Failed to unblock user");
      }
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["user", "doctor", "admin"]}>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">User Search</h1>
        <div className="bg-background p-6 rounded-lg shadow-md">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search users..."
            className="w-full px-4 py-3 rounded-xl bg-[#2A3441] text-gray-200 mb-4"
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <ul className="space-y-4">
            {users.map((u) => (
              <li
                key={u.id}
                className="bg-white dark:bg-[#2A3441] rounded-xl p-4 shadow flex justify-between items-center"
              >
                <div>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {u.username}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Role: {u.role} | Status: {u.blocked ? "Blocked" : "Active"}
                  </p>
                </div>
                {user?.id !== u.id && ( // Prevent self-blocking
                  <div className="flex gap-3">
                    {u.blocked ? (
                      <button
                        onClick={() => handleUnblock(u.id)}
                        className="text-green-500 hover:text-green-700 text-sm"
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBlock(u.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Block
                      </button>
                    )}
                    <Link
                      href={`/profile/${u.id}`}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      View Profile
                    </Link>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
}
