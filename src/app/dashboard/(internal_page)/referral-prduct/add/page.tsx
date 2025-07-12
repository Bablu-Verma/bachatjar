/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import TextEditor from "@/app/dashboard/_components/TextEditor";
import UploadImageGetLink from "@/app/dashboard/_components/Upload_image_get_link";
import { RootState } from "@/redux-store/redux_store";
import {  category_list_dashboard_api, referral_product_add_api } from "@/utils/api_url";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export interface IRefCampaign {
  title: string;
  rewardForUser: number;
  referralLink: string;
  category: string;
  imageUrl: string;
  description: string;
  status: "ACTIVE" | "PAUSE" | "DELETE";
}

const AddRefProduct = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const [categoryList, setCategoryList] = useState<{ name: string; _id: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  const [form_data, setForm_data] = useState<IRefCampaign>({
    title: "",
    rewardForUser: 0,
    referralLink: "",
    category: "",
    imageUrl: "",
    description: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await axios.post(
          category_list_dashboard_api,
          { status: "ACTIVE" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCategoryList(categoryRes.data.data || []);
      } catch (error) {
        console.log("Failed to fetch categories:", error);
      }
    };

    fetchData();
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm_data((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const requiredFields: (keyof IRefCampaign)[] = [
        "title", "category", "rewardForUser", "referralLink", "imageUrl", "description"
      ];

      const missingFields = requiredFields.filter((field) => {
        const value = field === "description" ? editorContent : form_data[field];
        return (
          value === undefined ||
          value === null ||
          (typeof value === "string" && value.trim() === "") ||
          (typeof value === "number" && value <= 0)
        );
      });

      if (missingFields.length > 0) {
        toast.error(`${missingFields.join(", ")} is required.`);
        return;
      }

      const formPayload = {
        ...form_data,
        description: editorContent,
      };

      await axios.post(referral_product_add_api, JSON.stringify(formPayload), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Product added successfully!");

      // Optional: Reset form after submit
      setForm_data({
        title: "",
        rewardForUser: 0,
        referralLink: "",
        category: "",
        imageUrl: "",
        description: "",
        status: "ACTIVE",
      });
      setEditorContent("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "An error occurred");
      } else {
        console.error("Unexpected error:", error);
        toast.error("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">Add Referral Deal</h1>

      <div className="max-w-4xl my-10 mx-auto p-5 bg-white border border-gray-50 rounded-lg shadow-sm">
        <UploadImageGetLink />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={form_data.title}
              onChange={handleChange}
              placeholder="Enter product title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="referralLink" className="block text-sm font-medium text-gray-700">
              Referral Link
            </label>
            <input
              type="text"
              id="referralLink"
              name="referralLink"
              value={form_data.referralLink}
              onChange={handleChange}
              placeholder="Paste referral link"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
            />
          </div>
          {/* Reward & Link */}


          {/* Category & Image */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={form_data.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categoryList.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={form_data.imageUrl}
                onChange={handleChange}
                placeholder="Paste image URL"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
              />
              {/* Optional Preview */}
              {form_data.imageUrl && (
                <img
                  src={form_data.imageUrl}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded mt-2"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label htmlFor="rewardForUser" className="block text-sm font-medium text-gray-700">
                Reward For User
              </label>
              <input
                type="number"
                id="rewardForUser"
                name="rewardForUser"
                value={form_data.rewardForUser}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={form_data.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="PAUSE">PAUSE</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </div>


          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Description</label>
            <TextEditor editorContent={editorContent} setEditorContent={setEditorContent} />
          </div>

          {/* Submit */}
          <div className="text-right">
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-500 rounded-lg shadow-lg"
              disabled={loading}
            >
              {loading ? "In Progress..." : "Add Ref Product"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddRefProduct;
