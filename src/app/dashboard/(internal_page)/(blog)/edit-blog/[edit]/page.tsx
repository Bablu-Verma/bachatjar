/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import TextEditor from "@/app/dashboard/_components/TextEditor";
import UploadImageGetLink from "@/app/dashboard/_components/Upload_image_get_link";
import { blog_type } from "@/constant";

import { ICategory } from "@/model/CategoryModel";
import { RootState } from "@/redux-store/redux_store";
import {
  blog_category_dashboard_list_api,
  blog_dashboard_details,
  blog_edit,
} from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Image from "next/image";
import DateTimePicker from "react-datetime-picker";

interface IClientBlog {
  blog_id: "";
  title: string;
  blog_category: string;
  blog_type:
    | "Article"
    | "Tutorial"
    | "Case Study"
    | "Review"
    | "Interview"
    | "";
  image: string[]; // Array of image URLs
  tags: string[]; // Tags for the blog
  reading_time: number; // Estimated reading time in minutes
  keywords: string[]; // SEO keywords
  publish_schedule: Date | null; // Date for scheduled publishing
  status: "ACTIVE" | "INACTIVE"; // Blog status
 
}

const EditBlog = ({}) => {
  const token = useSelector((state: RootState) => state.user.token);
  const pathname = usePathname();
  const router = useRouter();
  const [categoryList, setCategoryList] = useState([]);
  const [loding, setLoading] = useState<boolean>(false);
  const [form_data, setForm_data] = useState<IClientBlog>({
    blog_id: "",
    title: "",
    blog_category: "",
    blog_type: "",
    image: ["", ""],
    tags: [],
    reading_time: 0,
    keywords: [],
    publish_schedule: null,
    status: "ACTIVE",
  
  });

  const [short_desc, setShortDescription] = useState("");
  const [description_, setDescription] = useState("");
  const [images, setImages] = useState("");

  const urlslug = pathname.split("/").pop() || "";

  const getCategory = async () => {
    try {
      const { data } = await axios.post(
        blog_category_dashboard_list_api,
        { status: "ACTIVE" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategoryList(data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error ", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  useEffect(() => {
    getCategory();
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setForm_data((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const getBlogData = async () => {
    try {
      const { data } = await axios.post(
        blog_dashboard_details,
        {
          slug: urlslug,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log(data.data.blog);

      const blogData = data.data.blog;
      setForm_data({
        blog_id: blogData._id,
        title: blogData.title || "",
        blog_category: blogData.blog_category || "",
        blog_type:
          (blogData.blog_type as
            | "Article"
            | "Tutorial"
            | "Case Study"
            | "Review"
            | "Interview") || "Article",
        image: blogData.image || [],
        tags: blogData.tags || [],
        reading_time: blogData.reading_time || 0,
        keywords: blogData.keywords || [],
        publish_schedule: blogData.publish_schedule || null,
        status: (blogData.status as "ACTIVE" | "INACTIVE") || "ACTIVE",
       
      });

      setDescription(blogData.desc || "");
      setShortDescription(blogData.short_desc || "");
      toast.success("Blog details fetched successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error:", error.response?.data?.message);
        toast.error(error.response?.data?.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  useEffect(() => {
    getBlogData();
  }, [urlslug]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await axios.post(
        blog_edit,
        {
          blog_id: form_data.blog_id,
          title: form_data.title,
          category: form_data.blog_category, // Fixed key name
          short_desc: short_desc, // Ensure it's defined
          blog_type: form_data.blog_type, // Fixed key name
          desc: description_,
          slug: urlslug,
          image: form_data.image,
          status: form_data.status,
          tags: form_data.tags,
          publish_schedule: form_data.publish_schedule,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Blog updated successfully! Redirecting to blog list...");

      setTimeout(() => {
        router.push("/dashboard/blog-list");
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "An error occurred");
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const addImage = () => {
    if (images.trim() && form_data.image) {
      setForm_data((prev) => ({
        ...prev,
        image: [...prev.image!, images.trim()],
      }));
      setImages("");
    }
  };

  // Remove Image Link
  const removeImage = (index: number) => {
    setForm_data((prev) => ({
      ...prev,
      image: prev.image!.filter((_, i) => i !== index),
    }));
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImages(e.target.value);
  };

  const renderImagePreview = () => {
    return form_data.image!.map((image: string, index: number) => (
      <div key={index} className="flex items-center space-x-2">
        <Image
          src={image}
          alt={`Preview ${index + 1}`}
          width={64}
          height={64}
          className="w-16 h-16 object-cover rounded"
        />
        <button
          type="button"
          onClick={() => removeImage(index)}
          className="text-red-500 flex justify-center items-center bg-gray-200 rounded-full w-5 h-5"
        >
          <i className="fa-solid fa-x text-[12px]"></i>
        </button>
      </div>
    ));
  };

  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        Edit Blog
      </h1>
      <div className="max-w-4xl my-10 mx-auto p-5 bg-white border border-gray-50 rounded-lg shadow-sm">
        <UploadImageGetLink />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={form_data.title}
              onChange={handleChange}
              placeholder="Add blog title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
            />
          </div>

          <div className="">
            <label
              htmlFor="images"
              className="block text-sm font-medium text-gray-700"
            >
              Product Images
            </label>
            <div className="flex gap-1">
              <input
                type="text"
                id="images"
                placeholder="add your image link"
                name="images"
                value={images}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
                onChange={handleImageChange}
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2 ml-5 w-[260px] bg-blue-500 text-white rounded-lg shadow-sm"
              >
                Add
              </button>
            </div>

            <div id="imagePreview" className="mt-4 flex space-x-6">
              {renderImagePreview()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="blog_type"
                className="block text-sm font-medium text-gray-700"
              >
                Type
              </label>
              <select
                id="blog_type"
                name="blog_type"
                value={form_data.blog_type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              >
                <option value="" disabled selected>
                  Select a Blog Type
                </option>
                {blog_type.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="blog_category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="blog_category"
                name="blog_category"
                value={form_data.blog_category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              >
                <option value="" disabled selected>
                  Select a category
                </option>
                {categoryList.map((item: ICategory, i) => {
                  return (
                    <option key={i} value={item._id.toString()}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700"
              >
                Blog tags
              </label>
              <input
                type="text"
                name="tags"
                value={form_data.tags.join(", ")}
                onChange={(e) =>
                  setForm_data({
                    ...form_data,
                    tags: e.target.value.split(","),
                  })
                }
                placeholder="Product Tags Keywords (comma separated)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              />
            </div>
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700"
              >
                Blog keywords
              </label>
              <input
                type="text"
                name="keywords"
                value={form_data.keywords.join(", ")}
                onChange={(e) =>
                  setForm_data({
                    ...form_data,
                    keywords: e.target.value.split(","),
                  })
                }
                placeholder="Product Keywords (comma separated)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="reading_time"
                className="block text-sm font-medium text-gray-700"
              >
                reading_time
              </label>
              <input
                type="text"
                id="reading_time"
                name="reading_time"
                value={form_data.reading_time}
                onChange={handleChange}
                placeholder="Enter reading_time"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              />
            </div>
            <div>
              <label
                htmlFor="publish_schedule"
                className="block text-sm font-medium text-gray-700"
              >
                publish_schedule
              </label>
              <DateTimePicker
                format="dd-MM-yyyy HH:mm:ss"
                onChange={(date) =>
                  setForm_data((prev) => ({
                    ...prev,
                    publish_schedule: date ?? new Date(),
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
                value={
                  form_data.publish_schedule
                    ? new Date(form_data.publish_schedule)
                    : new Date()
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Blog Status
              </label>
              <select
                id="status"
                name="status"
                value={form_data.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              >
                <option value="" disabled selected>
                  status
                </option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor=""
              className="block text-sm font-medium text-gray-700"
            >
              Blog description
            </label>
            <TextEditor
              editorContent={description_}
              setEditorContent={setDescription}
            />
          </div>
          <div>
            <label
              htmlFor=""
              className="block text-sm font-medium text-gray-700"
            >
              Short desc
            </label>
            <TextEditor
              editorContent={short_desc}
              setEditorContent={setShortDescription}
            />
          </div>
          <div className="text-right pt-20">
            <button
              type="reset"
              onClick={() => window.location.reload()}
              className="px-6 py-2 text-red-500 rounded-lg shadow-lg font-medium focus:outline-none  mr-6"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={loding}
              className="px-6 py-2 text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none "
            >
              {loding ? "On Process" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditBlog;
