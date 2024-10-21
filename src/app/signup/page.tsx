'use client'
// /app/signup/page.jsx
import { useState } from "react";
import { api } from "../../lib/api";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await api.signup.post({
        username,
        password,
      });

      if (response.status === 201||response.status ===200) {
        router.push("/login");
      } else {
        setError(response.message || "Signup failed");
      }
    } catch (err) {
      setError("An error occurred during signup");
    }
  };

  return (
    <div className="min-h-screen bg-base-100 text-primary font-mono flex items-center justify-center">
      <div className="w-full max-w-sm p-8 border border-accent rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSignup}>
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
            Sign Up
          </button>
        </form>
        <p className="text-center text-primary mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-secondary hover:text-primary">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
