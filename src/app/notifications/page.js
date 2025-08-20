"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "@/app/context/AppContext";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function NotificationsDashboard() {
  const { token } = useAppContext();
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        } else {
          setError("No notifications available");
        }
      } catch {
        setError("Something went wrong");
      }
    };
    if (token) fetchNotifications();
  }, [token]);

  const markAsRead = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {
      setError("Failed to mark as read");
    }
  };

  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;
  if (!notifications.length)
    return <div className="p-6 text-center">Loading...</div>;

  return (
    <ProtectedRoute allowedRoles={["user", "doctor", "admin"]}>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
        <div className="bg-background p-6 rounded-lg shadow-md">
          <ul className="space-y-4">
            {notifications.map((notif) => (
              <li
                key={notif.id}
                className={`p-4 rounded-lg ${
                  notif.read ? "bg-gray-200 dark:bg-gray-700" : "bg-accent/10"
                }`}
              >
                <div className="text-foreground">
                  <strong>{notif.title}</strong> - {notif.message}
                  <p className="text-sm text-foreground/70">
                    {new Date(notif.date).toLocaleString()}
                  </p>
                </div>
                {!notif.read && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="mt-2 px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-sm"
                  >
                    Mark as Read
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
}
