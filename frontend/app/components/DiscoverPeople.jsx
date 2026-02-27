import React, { useEffect, useState } from "react";
import api from "../lib/api";

export default function DiscoverPeople({ onSelectFriend }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch discover users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get("/user/discover");
            setUsers(res.data);
        } catch (err) {
            console.error("Discover error:", err.response?.data || err.message);
            setError("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Send friend request
    const handleRequest = async (userId) => {
        try {
            await api.post(`/friends/request/${userId}`);

            // Update UI instantly
            //   setUsers((prev) =>
            //     prev.map((user) =>
            //       user.id === userId
            //         ? { ...user, requestSent: true }
            //         : user
            //     )
            //   ); 
            await fetchUsers();

        } catch (err) {
            console.error("Request error:", err.response?.data || err.message);
            alert("Failed to send request");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="bg-white rounded-xl p-4 shadow discover-panel max-h-175 overflow-y-auto">
            <h3 className="font-semibold mb-3">Discover People</h3>

            {users.length === 0 && (
                <p className="text-gray-500 text-sm">No users found</p>
            )}

            {users.map((u) => (
                <div
                    key={u.id}
                    className="flex justify-between items-center mb-3 border-b pb-2 user-item "
                >
                    <div>
                        <p className="font-medium">{u.name}-{u.id}</p>
                        <p className="text-xs text-gray-500">
                            {u.isFriend
                                ? "Friend"
                                : u.requestSent
                                    ? "Request Sent"
                                    : "Not Connected"}
                        </p>
                    </div>

                    {!u.isFriend ? (
                        <button
                            onClick={() => handleRequest(u.id)}
                            disabled={u.requestSent}
                            className={`px-3 py-1 rounded text-white transition cursor-pointer
                ${u.requestSent
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-500 hover:bg-blue-600"
                                }`}
                        >
                            {u.requestSent ? "Sent" : "Request"}
                        </button>
                    ) : (
                        <button
                            onClick={() => onSelectFriend(u)}  // ✅ this triggers ChatBox
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded cursor-pointer"
                        >
                            Message
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
