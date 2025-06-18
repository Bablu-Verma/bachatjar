'use client'

import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import SimpleLoader from "@/components/SimpleLoader";

import { RootState } from "@/redux-store/redux_store";
import { message_list_client_api, message_read_mark_client_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

interface Message {
    _id: string;
    title: string;
    body: string;
    read: 'FALSE' | 'TRUE';
    createdAt: string;
}


export default function NotificationList() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const token = useSelector((state: RootState) => state.user.token);



    const fetchMessages = async () => {
        setLoading(true);
        try {
            const res = await axios.post(
                message_list_client_api,
                { page: page },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const newMessages = res.data.data || [];

            setMessages((prev) => [...prev, ...newMessages]);
            setHasMore(newMessages.length > 0);
        } catch {
            toast.error("Failed to load messages",);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        fetchMessages();
    }, [page]);


    const markAsRead = async (id: string) => {
        try {
            await axios.post(
                message_read_mark_client_api,
                { messageId: id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessages((prev) =>
                prev.map((msg) =>
                    msg._id === id ? { ...msg, read: 'TRUE' } : msg
                )
            );
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message || "Error marking as read");
            } else {
                toast.error("Unexpected error");
            }
        }
    };


    return (
        <>
            <MainHeader />
            <div className="max-w-xl mx-auto pt-5 pb-20 px-2">
                <ul className="space-y-4">
                    {messages.length === 0 ? (
                        <p className="text-gray-500 text-center">No notifications yet.</p>
                    ) : (
                        messages.map((msg: Message) => {

                            return (
                                <li
                                    key={msg._id}
                                    className={`p-4 rounded-lg border ${msg.read == 'TRUE'
                                        ? "bg-gray-100 border-gray-200"
                                        : "bg-red-50 border-red-400"
                                        }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="test-base sm:text-md font-bold text-gray-800">
                                            {msg.title}
                                        </h3>
                                        <span className="text-[10px] sm:text-xs select-none text-gray-400">
                                            {new Date(msg.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="text-sm sm:text-base text-gray-700 mt-1">{msg.body}</div>
                                    {msg.read == 'FALSE' && (
                                        <button
                                            className="mt-2 select-none text-[12px] sm:text-sm text-blue-600 hover:underline"
                                            onClick={() => markAsRead(msg._id)}
                                        >
                                            Mark as read
                                        </button>
                                    )}
                                </li>
                            )
                        })
                    )}
                </ul>

                {/* 🔽 Load More Button */}
                {hasMore && (
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={() => setPage((prev) => prev + 1)}
                            className="text-sm  py-2 px-8 transition-all duration-300 ease-in-out rounded-full border-2 border-primary hover:border-white text-white bg-primary flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? <SimpleLoader /> : "More Message"}
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
