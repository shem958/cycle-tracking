"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "@/app/context/AppContext";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function CommunityFeed() {
  const { token } = useAppContext();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/community/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        } else {
          setError("No posts available");
        }
      } catch {
        setError("Something went wrong");
      }
    };
    if (token) fetchPosts();
  }, [token]);

  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;
  if (!posts.length) return <div className="p-6 text-center">Loading...</div>;

  return (
    <ProtectedRoute allowedRoles={["user", "doctor", "admin"]}>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Community Feed</h1>
        <div className="bg-background p-6 rounded-lg shadow-md">
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.id} className="p-4 rounded-lg bg-accent/10">
                <div className="text-foreground">
                  <strong>{post.title}</strong> - {post.content}
                  <p className="text-sm text-foreground/70">
                    {new Date(post.date).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
}
