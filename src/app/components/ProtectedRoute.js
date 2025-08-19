"use client";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../context/AppContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, token } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.push("/"); // Redirect to home if role not allowed
    }
  }, [token, user, allowedRoles, router]);

  if (!token || (allowedRoles && user && !allowedRoles.includes(user.role))) {
    return null;
  }

  return children;
}
