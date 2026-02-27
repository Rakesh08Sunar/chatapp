"use client";

import { Eye, Mail, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const togglePassword = (id) => {
    const input = document.getElementById(id);
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
  };


const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const { data } = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", data.token);

    router.push("/profile");
  } catch (err) {
    setError(err.response?.data?.message || "Invalid email or password");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 px-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-sky-400">Login</h1>
        </div>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium mb-2 text-black">
              <Mail size={16} /> Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-md px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-sky-400"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium mb-2 text-black">
              <Lock size={16} /> Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                id="loginPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-md px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-sky-400"
              />
              <Eye size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" onClick= {()=> togglePassword('loginPassword')} />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm mb-3">{error}</p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-500 hover:bg-sky-600 transition rounded-md py-2 flex items-center justify-center gap-2 text-white font-bold"
          >
            {loading ? "Logging in..." : <>Login <ArrowRight size={18} /></>}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
