"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../context/AppContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, token, isTokenExpired } = useAppContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // No token means not authenticated
      if (!token || isTokenExpired(token)) {
        setIsAuthorized(false);
        setIsLoading(false);
        router.push("/login");
        return;
      }

      // Check role authorization if roles are specified
      if (allowedRoles && user) {
        if (!allowedRoles.includes(user.role)) {
          setIsAuthorized(false);
          setIsLoading(false);
          router.push("/"); // Redirect to home if role not allowed
          return;
        }
      }

      // If we have token and user passes role check
      if (user) {
        setIsAuthorized(true);
        setIsLoading(false);
      } else {
        // Wait a bit more for user data to load
        setTimeout(() => {
          if (!user) {
            setIsAuthorized(false);
            setIsLoading(false);
            router.push("/login");
          }
        }, 1000);
      }
    };

    checkAuth();
  }, [token, user, allowedRoles, router, isTokenExpired]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-foreground/70">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-foreground/70">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return children;
}
