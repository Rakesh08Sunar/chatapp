"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import Navbar from "../components/Navbar";

export default function NotificationsPage() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/friends/requests");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const acceptRequest = async (requestId) => {
    try {
      await api.post(`/friends/accept/${requestId}`);
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
    <Navbar />
    <div className="max-w-2xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4">Friend Requests</h1>

      {requests.length === 0 && (
        <p className="text-gray-500">No friend requests</p>
      )}

      {requests.map((req) => (
        <div
          key={req.id}
          className="border p-4 rounded mb-3 bg-white shadow flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{req.sender.name}</p>
            <p className="text-sm text-gray-500">{req.sender.email}</p>
          </div>

          <button
            onClick={() => acceptRequest(req.id)}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Accept
          </button>
        </div>
      ))}
    </div>
    </>
  );
}
