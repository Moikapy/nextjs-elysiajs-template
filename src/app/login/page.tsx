'use client'
// /app/login/page.jsx
import { useState } from "react";
import { api } from "../../lib/api";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await api.login.post({
        username,
        password,
      });
      console.log(response);
      
      if (response.status === 200 && response.data.body.token) {
        // Save the token to local storage or cookies (you can choose your preferred storage method)
        localStorage.setItem("authToken", response.data.body.token);
        router.push("/");
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login");
    }
  };

  return (
    <div className="min-h-screen bg-base-100 text-primary font-mono flex items-center justify-center">
      <div className="w-full max-w-sm p-8 border border-accent rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Log In</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>
          {error && <p className="text-error text-sm mb-4">{error}</p>}
          <button type="submit" className="btn btn-primary w-full">
            Log In
          </button>
        </form>
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-secondary hover:text-primary">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
