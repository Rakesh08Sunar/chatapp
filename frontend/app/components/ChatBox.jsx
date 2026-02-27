"use client";

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import api from "../lib/api";

const socket = io("http://localhost:4000");

export default function ChatBox({ friend, currentUser }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const bottomRef = useRef(null);

    useEffect(() => {
        if (currentUser) {
            socket.emit("join", currentUser.id);
        }
    }, [currentUser]);

    useEffect(() => {
        if (friend) {
            api.get(`/chat/${friend.id}`).then(res => setMessages(res.data));
        }
    }, [friend]);

    useEffect(() => {
        socket.on("receiveMessage", (data) => {
            if (data.senderId === friend?.id) {
                setMessages(prev => [...prev, data]);
            }
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [friend]);
    useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

    const sendMessage = async () => {
        if (!text.trim() || !currentUser || !friend) return;

        const messageData = {
            senderId: currentUser.id,
            receiverId: friend.id,
            content: text,
        };

        await api.post(`/chat/${friend.id}`, { message: text });

        socket.emit("sendMessage", messageData);

        setMessages(prev => [...prev, { ...messageData }]);
        setText("");
    };
    
    if (!friend)
        return <div className="bg-white rounded-xl p-4">Select a friend</div>;

    return (
        <div className="bg-white rounded-xl p-4 flex flex-col max-h-175 chat-window">
            <div className="flex-1 overflow-y-auto space-y-2 ">
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`message p-2 rounded ${m.senderId === currentUser.id
                            ? "bg-blue-500 text-white ml-auto sent"
                            : "bg-gray-200 received"
                            }`}
                    >
                        {m.content}
                    </div>
                ))}
                 <div ref={bottomRef}></div>
            </div>

            <div className="flex gap-2 mt-3 chat-input">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 border p-2 rounded"
                    placeholder="Type a message..."
                />
                <button
                    onClick={sendMessage}
                    disabled={!friend || !currentUser}
                    className="bg-blue-500 text-white px-4 rounded disabled:bg-gray-400"
                >
                    Send
                </button>

            </div>
        </div>
    );
}
