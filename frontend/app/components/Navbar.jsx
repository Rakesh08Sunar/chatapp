"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import api from "../lib/api";

export default function Navbar() {
  const [count, setCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/notifications/unread-count");
      setCount(res.data);
    } catch (err) {
      console.error("Notification error:", err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      
      {/* Left Section */}
      <div className="flex items-center gap-6">
        <Link href="/" className="text-xl font-bold text-blue-600">
          ChatApp
        </Link>

        <Link href="/discover" className="text-gray-600 hover:text-blue-500">
          Discover
        </Link>

        <Link href="/friends" className="text-gray-600 hover:text-blue-500">
          Friends
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">

        {/* Notification */}
        <Link href="/notifications" className="relative">
          <Bell className="w-6 h-6 text-gray-600 hover:text-blue-500" />

          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
              {count}
            </span>
          )}
        </Link>

        {/* Profile */}
        <Link href="/profile" className="text-gray-600 hover:text-blue-500">
          Profile
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
