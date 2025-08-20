"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../context/AppContext";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { setUser, setToken } = useAppContext();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        setToken(result.token);
        setUser({
          id: result.user.id,
          username: result.user.username,
          role: result.user.role,
        });
        localStorage.setItem("token", result.token);
        router.push("/");
      } else {
        setError(result.message || "Registration failed. Please try again.");
      }
    } catch {
      setError(
        "An unexpected error occurred. Check your network or try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 dark:bg-gray-900">
      <div className="bg-[#1B2433] p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Register
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              type="text"
              {...register("username", { required: "Username is required" })}
              className="mt-1 block w-full p-2 rounded-xl bg-[#2A3441] text-gray-200 border-none focus:ring-2 focus:ring-pink-500"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="mt-1 block w-full p-2 rounded-xl bg-[#2A3441] text-gray-200 border-none focus:ring-2 focus:ring-pink-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="mt-1 block w-full p-2 rounded-xl bg-[#2A3441] text-gray-200 border-none focus:ring-2 focus:ring-pink-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-white p-2 rounded-xl hover:bg-pink-600 disabled:bg-pink-300 disabled:cursor-not-allowed transition-colors duration-300"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-300">
          Already have an account?{" "}
          <Link href="/login" className="text-pink-500 hover:text-pink-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
