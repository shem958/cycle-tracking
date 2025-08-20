"use client";
import { useState, useEffect } from "react";
import { useAppContext } from "@/app/context/AppContext";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Link from "next/link";

export default function UsersPage() {
  const { token } = useAppContext();
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
                    Role: {user.role}
                  </p>
                </div>
                <Link
                  href={`/profile/${user.id}`}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  View Profile
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
}
