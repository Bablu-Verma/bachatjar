"use client";

import {
  category_list_dashboard_api,
  edit_store_api,
  store_details_dashboard_api,
} from "@/utils/api_url";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import TextEditor from "@/app/dashboard/_components/TextEditor";
import UploadImageGetLink from "@/app/dashboard/_components/Upload_image_get_link";

const EditCategory: React.FC = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const pathname = usePathname();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
 const [formData, setFormData] = useState({
  name: "",
  store_img: "",
  store_type: "", 
  store_link: "",
  cashback_type: "",
  cashback_rate: "", // will parse to number before sending
  store_status: "",
  category: "",
  tracking: "",
  upto_amount: "",
  min_amount: "",
  claim_form: "",
});
  const [editorContent, setEditorContent] = useState("");
  const urlslug = pathname.split("/").pop() || "";
  const [editorContentTc, setEditorContentTc] = useState("");
  const [categoryList, setCategoryList] = useState<
    { name: string; _id: string }[]
  >([]);

 const getstoredetail = async () => {
  try {
    const { data } = await axios.post(
      store_details_dashboard_api,
      { slug: urlslug },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const store = data.data.store;

    setFormData({
      name: store.name || "",
      store_img: store.store_img || "",
      store_type: store.store_type || "", // updated key
      store_link: store.store_link || "",
      cashback_type: store.cashback_type || "",
      cashback_rate: store.cashback_rate?.toString() || "",
      store_status: store.store_status || "",
      category: store.category?._id || "",
      tracking: store.tracking || "",
      upto_amount: store.upto_amount?.toString() || "",
      min_amount: store.min_amount?.toString() || "",
      claim_form: store.claim_form || "",
    });

    setEditorContent(store.description || "");
    setEditorContentTc(store.tc || "");
  } catch (error) {
    toast.error(`Error fetching store details ${error}`);
  }
};


  useEffect(() => {
    getstoredetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlslug]);

  // Handle Input Changes

  // Handle Submit
 const handleSubmit = async () => {
  try {
    setLoading(true);

    const {
      name,
      store_img,
      store_type,
      store_link,
      cashback_type,
      cashback_rate,
      store_status,
      category,
      tracking,
      upto_amount,
      min_amount,
      claim_form,
    } = formData;

    // General validation
    if (!name.trim()) return toast.error("Store name is required.");
    if (!store_img.trim()) return toast.error("Store image is required.");
    if (!store_link.trim()) return toast.error("Store link is required.");
    if (!category.trim()) return toast.error("Category is required.");
    if (!editorContent.trim()) return toast.error("Description is required.");
    if (!editorContentTc.trim()) return toast.error("Terms & Conditions are required.");
    if (!store_type) return toast.error("Store type is required.");

    // Incentive-specific validation
    if (store_type === "INSENTIVE") {
      if (!cashback_type) return toast.error("Cashback type is required.");
      if (!cashback_rate.trim()) return toast.error("Cashback rate is required.");
      if (isNaN(Number(cashback_rate)) || Number(cashback_rate) <= 0)
        return toast.error("Cashback rate must be a positive number.");
      if (!tracking.trim()) return toast.error("Tracking info is required.");
      if (upto_amount && (isNaN(Number(upto_amount)) || Number(upto_amount) < 0))
        return toast.error("Upto amount must be a non-negative number.");
      if (min_amount && (isNaN(Number(min_amount)) || Number(min_amount) < 0))
        return toast.error("Min amount must be a non-negative number.");
    }

    const payload = {
      slug: urlslug,
      name: name.trim(),
      store_img: store_img.trim(),
      store_type,
      store_link: store_link.trim(),
      description: editorContent,
      tc: editorContentTc,
      cashback_type:  cashback_type,
      cashback_rate: Number(cashback_rate) ,
      upto_amount: Number(upto_amount) ,
      min_amount:  Number(min_amount) ,
      tracking:  tracking.trim() ,
      store_status,
      category,
      claim_form: claim_form.trim(),
    };


    console.log("payload",payload)
    await axios.post(edit_store_api, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Store updated successfully! Redirecting...");
    setTimeout(() => router.push("/dashboard/all-stores"), 3000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch {
    toast.error("An error occurred while updating the store.");
  }  finally {
    setLoading(false);
  }
};

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes] = await Promise.all([
          axios.post(
            category_list_dashboard_api,
            { status: "ACTIVE" },
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);
        setCategoryList(categoryRes.data.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        Edit Store
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter store name"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* Store Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Link
              </label>
              <input
                type="text"
                name="store_link"
                value={formData.store_link}
                onChange={handleInputChange}
                placeholder="Enter store link"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Store Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Image
              </label>
              <input
                type="text"
                name="store_img"
                value={formData.store_img}
                onChange={handleInputChange}
                placeholder="Add store image link"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cashback type
              </label>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cashback rate
              </label>
              <input
                type="number"
                name="cashback_rate"
                value={formData.cashback_rate}
                onChange={handleInputChange}
                placeholder="Enter cashback rate"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tracking time
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                max purchase amount
              </label>
              <input
                type="text"
                name="upto_amount"
                value={formData.upto_amount}
                onChange={handleInputChange}
                placeholder="Enter max purchase amount"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                min_amount purchase
              </label>
              <input
                type="text"
                name="min_amount"
                value={formData.min_amount}
                onChange={handleInputChange}
                placeholder="Enter min_amount purchase "
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>


          </div>
          <div className="grid grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                claim_form
              </label>
              <select
                name="claim_form"
                value={formData.claim_form}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACTIVE_CLAIM_FORM">ACTIVE_CLAIM_FORM</option>
                <option value="INACTIVE_CLAIM_FORM">INACTIVE_CLAIM_FORM</option>
              </select>
            </div>

            {/* Store Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Status
              </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Description
            </label>
            <TextEditor
              editorContent={editorContent}
              setEditorContent={setEditorContent}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Description
            </label>
            <TextEditor
              editorContent={editorContentTc}
              setEditorContent={setEditorContentTc}
            />
          </div>

          {/* Submit Button */}
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

export default EditCategory;
