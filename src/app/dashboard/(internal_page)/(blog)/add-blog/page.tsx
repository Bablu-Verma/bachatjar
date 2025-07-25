"use client";
import TextEditor from "@/app/dashboard/_components/TextEditor";
import UploadImageGetLink from "@/app/dashboard/_components/Upload_image_get_link";
import { blog_type } from "@/constant";
import { ICategory } from "@/model/CategoryModel";
import { RootState } from "@/redux-store/redux_store";
import {
  add__blog_,
  blog_category_dashboard_list_api,
} from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";


export   interface IClientBlog {
  title: string;
blog_category: string;
blog_type: "Article" | "Tutorial" | "Case Study" | "Review" | "Interview";
image: string[];
tags: string[];
reading_time: number;
keywords: string[];
publish_schedule: Date | null;
status: "ACTIVE" | "INACTIVE";
}

const AddBlog = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const [images, setImages] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [loding, setLoading] = useState<boolean>(false);
  const [form_data, setForm_data] = useState<IClientBlog>({
    title: "",
    blog_category: "",
    blog_type: "" as
      | "Article"
      | "Tutorial"
      | "Case Study"
      | "Review"
      | "Interview",
    image: [],
    tags: [],
    reading_time: 0,
    keywords: [],
    publish_schedule: null,
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
    
  });


  const [short_desc, setShortDescription] = useState("");
  const [description_, setDescription] = useState("");

  const getCategory = async () => {
    try {
      const { data } = await axios.post(
        blog_category_dashboard_list_api,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategoryList(data.data);

      // console.log(data.data)


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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
  
    setForm_data((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value, 
    }));
  };


  const validateForm = () => {
    // Trim input values to avoid unnecessary spaces
    const {
      title,
      blog_category,
      blog_type,
      image,
      tags,
      reading_time,
      keywords,
      publish_schedule,
      status
    } = form_data;
  
    // Validate Title
    if (!title.trim()) {
      toast.error("Title is required.");
      return false;
    }
  
    // Validate Blog Category
    if (!blog_category.trim()) {
      toast.error("Blog category is required.");
      return false;
    }
  
    // Validate Blog Type
    if (!blog_type) {
      toast.error("Please select a blog type.");
      return false;
    }
  
    // Validate Image (at least one image should be added)
    if (image.length === 0) {
      toast.error("Please upload at least one image.");
      return false;
    }
  
    // Validate Tags (optional, but check if it's an array)
    if (!Array.isArray(tags)) {
      toast.error("Tags must be an array.");
      return false;
    }
  
    // Validate Reading Time (should be a positive number)
    if (reading_time <= 0) {
      toast.error("Reading time must be greater than 0.");
      return false;
    }
  
    // Validate Keywords
    if (keywords.length === 0) {
      toast.error("Please add at least one keyword.");
      return false;
    }
  
    // Validate Publish Schedule (should not be empty)
    if (!publish_schedule) {
      toast.error("Publish schedule is required.");
      return false;
    }
  
    // Validate Status
    if (!status) {
      toast.error("Please select a status.");
      return false;
    }
  
    return true; // Return true if all validations pass
  };
  

  const handleSubmit = async () => {
    if (!validateForm()) {
      return; 
    }
    try {
      setLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data } = await axios.post(
        add__blog_,
        {
          ...form_data,
          short_desc:short_desc,
          desc:description_
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Blog added successfully!");

      setTimeout(() => {
        window.location.reload();
      }, 4000);
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


  // console.log(form_data)


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
        Add Blog
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm z-10"
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

export default AddBlog;
