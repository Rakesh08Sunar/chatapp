"use client";

import { useState } from "react";
import { User, Mail, Lock, Eye, ArrowRight } from "lucide-react";
import api from "../lib/api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const togglePassword = (id) => {
    const input = document.getElementById(id);
    if (input) input.type = input.type === "password" ? "text" : "password";
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      alert("Registration successful");
      window.location.href = "/login";
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-card rounded-2xl shadow-2xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-sky-400">Register</h1>
        </div>

        {/* Full Name */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <User size={16} /> Full Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            type="text"
            placeholder="Enter your full name"
            required
            className="w-full rounded-md px-4 py-2 border"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <Mail size={16} /> Email Address
          </label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="Enter your email"
            required
            className="w-full rounded-md px-4 py-2 border"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <Lock size={16} /> Password
          </label>
          <div className="relative">
            <input
              name="password"
              id="pass"
              value={form.password}
              onChange={handleChange}
              type="password"
              placeholder="Create a password"
              required
              className="w-full rounded-md px-4 py-2 border"
            />
            <Eye
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => togglePassword("pass")}
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <Lock size={16} /> Confirm Password
          </label>
          <div className="relative">
            <input
              name="confirmPassword"
              id="cnfpass"
              value={form.confirmPassword}
              onChange={handleChange}
              type="password"
              placeholder="Confirm your password"
              required
              className="w-full rounded-md px-4 py-2 border"
            />
            <Eye
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => togglePassword("cnfpass")}
            />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
 
        {/* Register Button */}
        <button
          type="submit"
          disabled={loading} 
          className="w-full bg-sky-500 text-white rounded-md py-2 font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-sky-600 transition"
        >
          {loading ? "Creating..." : "Create Account"}{" "}
          <ArrowRight size={18} />
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-sky-500 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
