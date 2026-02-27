"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatBox from "../components/ChatBox";
import DiscoverPeople from "../components/DiscoverPeople";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import api from "../lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/user/me");
        setCurrentUser(data);
      } catch (err) {
        localStorage.clear();
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

  if (!currentUser) return null;

  return (
    <>
      <Navbar />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 ">
        {/* ✅ Pass user */}
        <ProfileCard user={currentUser} />

        <ChatBox
          friend={selectedFriend}
          currentUser={currentUser}
        />

        <DiscoverPeople onSelectFriend={setSelectedFriend} />
      </div>
    </>
  );
}


