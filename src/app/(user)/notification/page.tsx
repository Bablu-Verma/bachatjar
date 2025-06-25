'use client'

import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import SimpleLoader from "@/components/SimpleLoader";
import { IMessage } from "@/model/Message";
import { RootState } from "@/redux-store/redux_store";
import {
  setNotifications,
  markAsRead as markAsReadRedux,
  cleareNotifications,
} from "@/redux-store/slice/notificationSlice";
import { message_list_client_api, message_read_mark_client_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function NotificationList() {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const token = useSelector((state: RootState) => state.user.token);
  const notification = useSelector((state: RootState) => state.notification.items);
  const dispatch = useDispatch();

  const unreadCount = notification.filter(n => n.read === 'FALSE').length;

  // Clear previous notifications only once
  useEffect(() => {
    dispatch(cleareNotifications());
  }, [dispatch]);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        message_list_client_api,
        { page },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newMessages: IMessage[] = res.data.data || [];

      // Prevent duplicates
      const existingIds = new Set(notification.map(n => n._id.toString()));
      const filteredMessages = newMessages.filter(m => !existingIds.has(m._id.toString()));

      dispatch(setNotifications([...notification, ...filteredMessages]));
      setHasMore(newMessages.length > 0);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [page, token, notification, dispatch]);

  useEffect(() => {
    fetchMessages();
  }, []);

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

      dispatch(markAsReadRedux(id));
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
        {unreadCount > 0 && (
          <div className="text-center text-sm mb-4 text-red-600">
            🔔 {unreadCount} unread notification{unreadCount > 1 && 's'}
          </div>
        )}

        <ul className="space-y-4">
          {notification.length === 0 ? (
            <p className="text-gray-500 text-center">No notifications yet.</p>
          ) : (
            notification.map((msg: IMessage) => (
              <li
                key={msg._id.toString()}
                className={`p-4 rounded-lg border ${msg.read === 'TRUE'
                  ? "bg-gray-100 border-gray-200"
                  : "bg-red-50 border-red-400"
                  }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-base sm:text-md font-bold text-gray-800">
                    {msg.title}
                  </h3>
                  <span className="text-[10px] sm:text-xs select-none text-gray-400">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm sm:text-base text-gray-700 mt-1">{msg.body}</div>
                {msg.read === 'FALSE' && (
                  <button
                    className="mt-2 select-none text-[12px] sm:text-sm text-blue-600 hover:underline"
                    onClick={() => markAsRead(msg._id.toString())}
                  >
                    Mark as read
                  </button>
                )}
              </li>
            ))
          )}
        </ul>

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="text-sm py-2 px-8 transition-all duration-300 ease-in-out rounded-full border-2 border-primary hover:border-white text-white bg-primary flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? <SimpleLoader /> : "More Messages"}
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
