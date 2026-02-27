"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";
import Navbar from "../components/Navbar";

export default function FriendsPage() {
  const [friends, setFriends] = useState([]);
  const router = useRouter();

  const fetchFriends = async () => {
    try {
      const res = await api.get("/friends");
      setFriends(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const openChat = (friendId) => {
    router.push(`/chat/${friendId}`);
  };

  return (
    <>
    <Navbar />
    <div className="max-w-2xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4">My Friends</h1>

      {friends.length === 0 && (
        <p className="text-gray-500">No friends yet</p>
      )}

      {friends.map((friend) => (
        <div
          key={friend.id}
          className="border p-4 rounded mb-3 bg-white shadow flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{friend.name}</p>
            <p className="text-sm text-gray-500">{friend.email}</p>
          </div>

          <button
            onClick={() => openChat(friend.id)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Chat
          </button>
        </div>
      ))}
    </div>
    </>
    
  );
}
