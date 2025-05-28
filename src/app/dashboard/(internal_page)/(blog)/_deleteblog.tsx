import { IBlog } from "@/model/BlogModal";
import { RootState } from "@/redux-store/redux_store";
import { blog_delete } from "@/utils/api_url";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

interface BeleteBlogProps {
  item: IBlog;
}

const Deleteblog: React.FC<BeleteBlogProps> = ({ item }) => {
  const [getSlug, setGetSlug] = useState<string>();
  const token = useSelector((state: RootState) => state.user.token);

  const handleDeleteBlog = async (slug: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data } = await axios.post(
        blog_delete,
        { slug: slug },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTimeout(()=>{
        toast.success("Blog delete successfully!");
        setGetSlug('')
      })

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "An error occurred");
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setGetSlug(item.slug)}
        className="px-2 py-1 text-sm inline-block ml-5 text-red-500 hover:underline"
      >
        Delete
      </button>
      {item.slug === getSlug && (
        <div
          style={{ background: "rgba(0,0,0,0.3)" }}
          className="fixed top-0 right-0 left-0 bottom-0 flex justify-center items-center z-20 "
        >
          <div className="bg-white p-5 rounded-md max-w-[500px] w-[90%] ">
            <h2 className="text-lg text-red-600 pb-1">
              Do you want to delete this blog{" "}
            </h2>
            <p className="text-base text-secondary line-clamp-2 mb-3">
              {item.title}
            </p>

            <div className="pt-3">
              <button
                onClick={() => handleDeleteBlog(item.slug)}
                className="px-5 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 text-sm"
              >
                Delete
              </button>
              <button
                onClick={() => setGetSlug("")}
                className="px-5 py-2 ml-3 text-white bg-gray-400 rounded-md hover:bg-gray-500 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Deleteblog;
