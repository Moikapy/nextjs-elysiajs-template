'use client'
// /app/profile/page.jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await api.profile.get({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setUser(response.data.body.user);
        } else {
          setError(response.message || "Failed to load profile");
          localStorage.removeItem("authToken");
          router.push("/login");
        }
      } catch (err) {
        setError("An error occurred while fetching profile");
        localStorage.removeItem("authToken");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-base-100 text-primary font-mono flex items-center justify-center">
      <div className="w-full max-w-md p-8 border border-accent rounded-lg">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-error text-center">{error}</p>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center">Profile</h2>
            <div className="mb-4">
              <p className="text-lg">
                <strong>Username:</strong> {user?.username}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-outline btn-primary w-full mt-4"
            >
              Log Out
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
