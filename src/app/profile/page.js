"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "@/app/context/AppContext";
import { useForm } from "react-hook-form";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Link from "next/link";

export default function ProfilePage() {
  const { user, setUser, token } = useAppContext();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setValue("username", user.username);
      setValue("email", user.email);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:8080/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setSuccess("Profile updated successfully");
        setError("");
      } else {
        const result = await res.json();
        setError(result.message || "Failed to update profile");
        setSuccess("");
      }
    } catch {
      setError("Something went wrong");
      setSuccess("");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["user", "doctor", "admin"]}>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Your Profile</h1>
        <div className="bg-background p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300">Username</label>
              <input
                type="text"
                {...register("username", { required: "Username is required" })}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-[#2A3441] text-gray-200"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-300">Email</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-[#2A3441] text-gray-200"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-medium text-lg"
            >
              Update Profile
            </button>
          </form>
          <Link
            href="/"
            className="mt-4 inline-block text-foreground/70 hover:text-foreground text-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}
