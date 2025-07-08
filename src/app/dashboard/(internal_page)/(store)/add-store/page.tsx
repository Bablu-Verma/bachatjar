"use client";

import TextEditor from "@/app/dashboard/_components/TextEditor";
import UploadImageGetLink from "@/app/dashboard/_components/Upload_image_get_link";
import { RootState } from "@/redux-store/redux_store";
import { add_store_api, category_list_dashboard_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const AddStore = () => {
  const [formData, setFormData] = useState({
    name: "",
    store_img: "",
    store_type: "INSENTIVE" as "INSENTIVE" | "NON_INSENTIVE",
    store_link: "",
    cashback_type: "PERCENTAGE" as "PERCENTAGE" | "FLAT_AMOUNT",
    cashback_rate: "",
    upto_amount: "",
    min_amount: "",
    store_status: "ACTIVE" as "ACTIVE" | "INACTIVE",
    category: "",
    tracking: "",
  });

  const [editorContent, setEditorContent] = useState("");
  const [editorContentTc, setEditorContentTc] = useState("");
  const [loading, setLoading] = useState(false);
  const token = useSelector((state: RootState) => state.user.token);
  const [categoryList, setCategoryList] = useState<{ name: string; _id: string }[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      name,
      store_img,
      store_link,
      store_type,
      cashback_type,
      cashback_rate,
      store_status,
      upto_amount,
      min_amount,
      category,
      tracking,
    } = formData;

    if (!name.trim()) return toast.error("Please enter a store name.");
    if (!store_img.trim()) return toast.error("Please enter a store image link.");
    if (!store_link.trim()) return toast.error("Please enter a store link.");
    if (!category.trim()) return toast.error("Please select a category.");
    if (!editorContent.trim()) return toast.error("Please enter a store description.");
    if (!editorContentTc.trim()) return toast.error("Please enter store terms and conditions.");

    if (!cashback_type) return toast.error("Please select a cashback type.");
    if (!cashback_rate.trim()) return toast.error("Please enter cashback amount.");
    if (isNaN(Number(cashback_rate)) || Number(cashback_rate) <= 0)
      return toast.error("Cashback amount must be a valid number greater than 0.");

    if (!store_type) return toast.error("Please select store type.");

    if (store_type === "INSENTIVE") {
      if (!tracking.trim()) return toast.error("Please enter tracking information.");

      if (upto_amount && (isNaN(Number(upto_amount)) || Number(upto_amount) < 0)) {
        return toast.error("Upto amount must be a valid non-negative number.");
      }

      if (min_amount && (isNaN(Number(min_amount)) || Number(min_amount) < 0)) {
        return toast.error("Min amount must be a valid non-negative number.");
      }
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        add_store_api,
        {
          name: name.trim(),
          description: editorContent.trim(),
          tc: editorContentTc.trim(),
          store_img: store_img.trim(),
          store_link: store_link.trim(),
          cashback_type,
          cashback_rate: Number(cashback_rate),
          upto_amount: upto_amount ? Number(upto_amount) : undefined,
          min_amount: min_amount ? Number(min_amount) : undefined,
          store_status,
          category,
          tracking: store_type === "INSENTIVE" ? tracking.trim() : "",
          claim_form : 'INACTIVE_CLAIM_FORM',
          store_type,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } else {
        console.error("Unknown error", error);
      }
    } finally {
      setLoading(false);
    }
  };


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
        console.log("Failed to fetch categories", error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">Add Store</h1>
      <div className="max-w-4xl my-10 mx-auto p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
        <UploadImageGetLink />
        <form onSubmit={handleSubmit} className="space-y-6">
         

          <div className="grid grid-cols-2 gap-5">
            {/* Store Link */}
             <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter store name"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Link</label>
              <input
                type="text"
                name="store_link"
                value={formData.store_link}
                onChange={handleInputChange}
                placeholder="Enter store link"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

           
          </div>

          <div className="grid grid-cols-3 gap-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">store_type</label>
              <select
                name="store_type"
                value={formData.store_type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="INSENTIVE">INSENTIVE</option>
                <option value="NON_INSENTIVE">NON_INSENTIVE</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cashback Rate</label>
              <input
                type="number"
                name="cashback_rate"
                value={formData.cashback_rate}
                onChange={handleInputChange}
                placeholder="Enter cashback cashback_rate"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Cashback Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cashback Type</label>
              <select
                name="cashback_type"
                value={formData.cashback_type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="PERCENTAGE">PERCENTAGE</option>
                <option value="FLAT_AMOUNT">FLAT_AMOUNT</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
         
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">max purchase Amount</label>
              <input
                type="text"
                name="upto_amount"
                value={formData.upto_amount}
                onChange={handleInputChange}
                placeholder="Enter max purchase Amount "
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">min purchase Amount</label>
              <input
                type="text"
                name="min_amount"
                value={formData.min_amount}
                onChange={handleInputChange}
                placeholder="Enter min purchase Amount "
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tracking time</label>
              <input
                type="text"
                name="tracking"
                value={formData.tracking}
                onChange={handleInputChange}
                placeholder="Enter tracking time "
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              >
                <option value="" disabled selected>
                  Select a category
                </option>
                {categoryList.map((item, i) => {
                  return (
                    <option key={i} value={item._id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>

          </div>

<div className="grid grid-cols-2 gap-5">
   {/* Store Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Image</label>
              <input
                type="text"
                name="store_img"
                value={formData.store_img}
                onChange={handleInputChange}
                placeholder="Add store image link"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Store Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Store Status</label>
            <select
              name="store_status"
              value={formData.store_status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
</div>

          

          {/* Store Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Store Description</label>
            <TextEditor editorContent={editorContent} setEditorContent={setEditorContent} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Store tC</label>
            <TextEditor editorContent={editorContentTc} setEditorContent={setEditorContentTc} />
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button type="submit" className="px-6 py-2 text-white bg-blue-500 rounded-lg shadow-lg" disabled={loading}>
              {loading ? "In Progress" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddStore;
