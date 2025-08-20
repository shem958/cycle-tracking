"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "@/app/context/AppContext";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import CycleHistory from "@/app/components/CycleHistory";

export default function PublicProfilePage() {
  const { token, user: currentUser } = useAppContext();
  const { id } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [cycles, setCycles] = useState([]);
  const [error, setError] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [userRes, cyclesRes] = await Promise.all([
          fetch(`http://localhost:8080/api/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:8080/api/cycles?userId=${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        if (userRes.ok && cyclesRes.ok) {
          const userData = await userRes.json();
          const cyclesData = await cyclesRes.json();
          setProfileUser(userData);
          setCycles(cyclesData);
          setValue("bio", userData.bio || "");
        } else {
          setError("User not found");
        }
      } catch {
        setError("Something went wrong");
      }
    };
    if (token && id) fetchProfile();
  }, [token, id, setValue]);

  const onBioSubmit = async (data) => {
    try {
      const res = await fetch(`http://localhost:8080/api/users/${id}/bio`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio: data.bio }),
      });
      if (res.ok) {
        setProfileUser((prev) => ({ ...prev, bio: data.bio }));
        setIsEditingBio(false);
      } else {
        setError("Failed to update bio");
      }
    } catch {
      setError("Something went wrong");
    }
  };

  if (!profileUser) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

  const isOwner = currentUser?.id === profileUser.id;

  return (
    <ProtectedRoute allowedRoles={["user", "doctor", "admin"]}>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">
          Profile: {profileUser.username}
        </h1>
        <div className="bg-background p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center mb-6">
            <Image
              src={profileUser.avatar || "/default-avatar.png"}
              alt={`${profileUser.username}'s Avatar`}
              width={128}
              height={128}
              className="rounded-full object-cover mb-4"
            />
            <p className="text-gray-300">Role: {profileUser.role}</p>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-foreground">Bio</h3>
            {isEditingBio && isOwner ? (
              <form onSubmit={handleSubmit(onBioSubmit)} className="space-y-4">
                <textarea
                  {...register("bio", { required: "Bio is required" })}
                  className="w-full mt-2 px-4 py-3 rounded-xl bg-[#2A3441] text-gray-200"
                  rows="3"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white"
                >
                  Save Bio
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingBio(false)}
                  className="ml-2 px-4 py-2 rounded-xl bg-gray-500 hover:bg-gray-600 text-white"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div>
                <p className="text-foreground">
                  {profileUser.bio || "No bio yet"}
                </p>
                {isOwner && (
                  <button
                    onClick={() => setIsEditingBio(true)}
                    className="mt-2 px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    Edit Bio
                  </button>
                )}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-foreground">
              Cycle History
            </h3>
            {cycles.length > 0 ? (
              <CycleHistory cycles={cycles} />
            ) : (
              <p className="text-foreground/80">No cycles recorded yet.</p>
            )}
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
