"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";
import {Edit, Save, LogOut } from "lucide-react";

export default function ProfileCard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: 0,
    gender: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/user/me");
        setUser(data);
        setForm(data);
      } catch (err) {
        localStorage.clear();
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleChange = (e) => {
    if (e.target.name === "age") {
      setForm({ ...form, [e.target.name]: parseInt(e.target.value) });
    }else{
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async () => {
    try {
   
      const { data } = await api.put("/user/me", form);
      setUser(data);
      setEdit(false);
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (loading || !user) return null;

  return (
    <div className=" bg-gray-100 flex items-center justify-center px-4 profile-card max-h-175">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-4">

        {/* Avatar */}
        <div className="text-center mb-6 ">
          <div className="w-20 h-20 mx-auto rounded-full bg-sky-500 flex items-center justify-center text-white text-3xl font-bold avatar">
            {user.name?.charAt(0)}
          </div>
          <h2 className="text-xl font-semibold mt-3">{user.name}-{user.id}</h2>
          <p className="text-gray-500">My Profile</p>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {["name", "email", "age", "gender"].map((field) => (
            <div key={field}>
              <label className="text-sm text-gray-500 capitalize">
                {field}
              </label>
              <input
                name={field}
                value={form[field] || ""}
                disabled={!edit}
                onChange={handleChange}
                className={`w-full mt-1 p-2 border rounded-md ${
                  edit ? "bg-white" : "bg-gray-100"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          {!edit ? (
            <button
              onClick={() => setEdit(true)}
              className="flex-1 bg-sky-500 text-white py-2 rounded-md flex items-center justify-center gap-2"
            >
              <Edit size={18} /> Edit
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex-1 bg-green-500 text-white py-2 rounded-md flex items-center justify-center gap-2"
            >
              <Save size={18} /> Save
            </button>
          )}

          <button
            onClick={handleLogout}
            className="flex-1 bg-red-500 text-white py-2 rounded-md flex items-center justify-center gap-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
