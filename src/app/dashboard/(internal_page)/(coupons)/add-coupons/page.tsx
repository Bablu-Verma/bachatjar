"use client";

import TextEditor from "@/app/dashboard/_components/TextEditor";
import UploadImageGetLink from "@/app/dashboard/_components/Upload_image_get_link";
import { RootState } from "@/redux-store/redux_store";
import {
  add_coupons_api,
  category_list_dashboard_api,
  list_store_dashboard_api,
} from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const AddCoupons = () => {
  const [formData, setFormData] = useState({
    title:'',
    code: "",
    discount: "",
    expiry_date:  new Date(),
    store: "",
    category: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  const [store, setStore] = useState<{ _id: string; name: string }[]>([]);
  const [category, setCategory] = useState<{ _id: string; name: string }[]>([]);
  const [editorContent, setEditorContent] = useState("");
  const [loading, setLoading] = useState(false);
  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storeRes, categoryRes] = await Promise.all([
          axios.post(
            list_store_dashboard_api,
            { store_status: "ACTIVE" },
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.post(
            category_list_dashboard_api,
            { status: "ACTIVE" },
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);

        setStore(storeRes.data.data || []);
        setCategory(categoryRes.data.data || []);
      } catch (error) {
        handleError(error);
      }
    };

    fetchData();
  }, [token]);


  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


   // **Form Validation**
   const validateForm = () => {
    if (!formData.code.trim()) return "Coupon code is required";
    if (!formData.title.trim()) return "Coupon title is required";
    if (!formData.discount.trim()) return "Discount amount is required";
    if (!formData.store.trim()) return "Please select a store";
    if (!formData.category.trim()) return "Please select a category";
    if (!editorContent.trim()) return "Store description is required";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errorMessage = validateForm();
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        add_coupons_api,
        {
          ...formData,
          expiry_date: formData.expiry_date.toISOString(),
          description: editorContent,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(data.message);
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error: unknown) => {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } else {
      console.error("Unknown error", error);
    }
  };

  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        Add Coupons
      </h1>
      <div className="max-w-4xl my-10 mx-auto p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
        <UploadImageGetLink />
        <form onSubmit={handleSubmit} className="space-y-6">
        <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter coupon title"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="Enter coupon code"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount
              </label>
              <input
                type="text"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                placeholder="Enter discount amount/percentage"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store
              </label>
              <select
                name="store"
                value={formData.store}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              >
                <option disabled value="">
                  Select Store
                </option>
                {store.map((item, i) => (
                  <option key={i} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              >
                <option disabled value="">
                  Select Category
                </option>
                {category.map((item, i) => (
                  <option key={i} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <DateTimePicker
                format="dd-MM-yyyy HH:mm:ss"
                onChange={(date: Date | null) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    expiry_date: date ?? new Date(),
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
                value={formData.expiry_date}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Store Description
          </label>
          <TextEditor
            editorContent={editorContent}
            setEditorContent={setEditorContent}
          />

          <div className="text-right">
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-500 rounded-lg shadow-lg"
              disabled={loading}
            >
              {loading ? "In Progress" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddCoupons;
