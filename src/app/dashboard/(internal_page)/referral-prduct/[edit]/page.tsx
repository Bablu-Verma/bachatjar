/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import TextEditor from "@/app/dashboard/_components/TextEditor";
import UploadImageGetLink from "@/app/dashboard/_components/Upload_image_get_link";
import { RootState } from "@/redux-store/redux_store";
import { category_list_dashboard_api, referral_product_details_api, referral_product_edit_api } from "@/utils/api_url";
import axios from "axios";
import { usePathname } from "next/navigation";
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

const EditRefProduct = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const pathname = usePathname();
  const slug = pathname.split("/").pop() || "";

  const [categoryList, setCategoryList] = useState<{ name: string; _id: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [_id, setId]= useState('')

  const [form_data, setForm_data] = useState<IRefCampaign>({
    title: "",
    rewardForUser: 0,
    referralLink: "",
    category: "",
    imageUrl: "",
    description: "",
    status: "ACTIVE",
  });

  // Fetch categories and product data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, productRes] = await Promise.all([
          axios.post(
            category_list_dashboard_api,
            { status: "ACTIVE" },
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.post(referral_product_details_api,{slug}, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setCategoryList(categoryRes.data.data || []);

        const product = productRes.data.data;
        // console.log(product)
        setId(product._id)
        setForm_data({
          title: product.title || "",
          rewardForUser: product.rewardForUser || 0,
          referralLink: product.referralLink || "",
          category: product.category._id || "",
          imageUrl: product.imageUrl || "",
          description: product.description || "",
          status: product.status || "ACTIVE",
        });
        setEditorContent(product.description || "");
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load product details.");
      }
    };

    fetchData();
  }, [slug, token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm_data((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const requiredFields: (keyof IRefCampaign)[] = [
        "title",
        "category",
        "rewardForUser",
        "referralLink",
        "imageUrl",
        "description",
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

      const payload = {
        ...form_data,
        description: editorContent,
        _id,
      };

      await axios.post(`${referral_product_edit_api}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Referral product updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  // console.log(categoryList)
  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">Edit Referral Product</h1>

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
              className="w-full px-4 py-2 border rounded"
              placeholder="Enter product title"
            />
          </div>

          {/* Referral Link */}
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
              className="w-full px-4 py-2 border rounded"
              placeholder="Paste referral link"
            />
          </div>

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
                className="w-full px-4 py-2 border rounded"
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
                className="w-full px-4 py-2 border rounded"
                placeholder="Paste image URL"
              />
              {form_data.imageUrl && (
                <img
                  src={form_data.imageUrl}
                  alt="Preview"
                  className="w-32 h-32 object-cover mt-2 rounded"
                />
              )}
            </div>
          </div>

          {/* Reward and Status */}
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
                className="w-full px-4 py-2 border rounded"
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
                className="w-full px-4 py-2 border rounded"
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
              className="px-6 py-2 bg-blue-500 text-white rounded shadow"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditRefProduct;
