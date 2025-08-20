"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "@/app/context/AppContext";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Image from "next/image";
import Link from "next/link";

export default function PublicProfilePage() {
  const { token } = useAppContext();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setError("User not found");
        }
      } catch {
        setError("Something went wrong");
      }
    };
    if (token && id) fetchUser();
  }, [token, id]);

  if (!user) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

  return (
    <ProtectedRoute allowedRoles={["user", "doctor", "admin"]}>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">
          Profile: {user.username}
        </h1>
        <div className="bg-background p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center mb-6">
            <Image
              src={user.avatar || "/default-avatar.png"}
              alt={`${user.username}'s Avatar`}
              width={128}
              height={128}
              className="rounded-full object-cover mb-4"
            />
            <p className="text-gray-300">Role: {user.role}</p>
          </div>
          <Link
            href="/users"
            className="mt-4 inline-block text-foreground/70 hover:text-foreground text-sm"
          >
            Back to Users
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}
