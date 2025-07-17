"use client";

import React, { useEffect, useState } from "react";
import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineDislike,
  AiFillDislike,
} from "react-icons/ai";
import { FaRegShareSquare } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { blog_action_like_dislike } from "@/utils/api_url";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";

interface ILikeDislike {
  blog_id: string;
  extra: {
    userAction: "LIKE" | "DISLIKE" | "NO_ACTION" | null;
    totalLikes: number;
    totalDislikes: number;
  };
}

const LikeDislike: React.FC<ILikeDislike> = ({ blog_id, extra }) => {
  const [currentAction, setCurrentAction] = useState<"LIKE" | "DISLIKE" | "NO_ACTION">("NO_ACTION");
  const [likes, setLikes] = useState<number>(0);
  const [dislikes, setDislikes] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    if (extra) {
      setCurrentAction(extra.userAction || "NO_ACTION");
      setLikes(extra.totalLikes);
      setDislikes(extra.totalDislikes);
    }
  }, [extra]);

  const handleAction = async (action: "like" | "dislike") => {
    if (!token) {
      toast.error("Please login to like or dislike this blog.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        blog_action_like_dislike,
        { blog_id, action },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
        const { likes, dislikes, action: newAction } = res.data.data;
        setLikes(likes);
        setDislikes(dislikes);
        setCurrentAction(newAction);
      }
    } catch (error) {
      console.error("Error updating blog reaction:", error);
      toast.error("Failed to update like/dislike. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Blog link copied to clipboard!");
  };

  return (
    <div className="flex gap-10 justify-start items-center py-4 text-md border-t-[1px] border-t-gray-300 pt-3 mt-6">
     
     <div className="flex gap-3 items-center">
       <button
        type="button"
        disabled={loading}
        onClick={() => handleAction("like")}
        className={`flex items-center gap-2 ${
          currentAction === "LIKE" ? "text-green-600" : "text-gray-600"
        } hover:text-green-800 transition-all`}
      >
        {currentAction === "LIKE" ? <AiFillLike className="text-lg " /> : <AiOutlineLike className="text-lg " />}
        <span>{likes}</span>
      </button>

     
      <button
        type="button"
        disabled={loading}
        onClick={() => handleAction("dislike")}
        className={`flex items-center gap-2 ${
          currentAction === "DISLIKE" ? "text-red-600" : "text-gray-600"
        } hover:text-red-800 transition-all`}
      >
        {currentAction === "DISLIKE" ? <AiFillDislike className="text-lg " /> : <AiOutlineDislike className="text-lg "/>}
        <span >{dislikes}</span>
      </button>
     </div>

      {/* Share Button */}
      <button
        type="button"
        onClick={handleShare}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-all"
      >
        <FaRegShareSquare className="text-lg "/>
        <span className="text-sm">Share this Blog</span>
      </button>
    </div>
  );
};

export default LikeDislike;
