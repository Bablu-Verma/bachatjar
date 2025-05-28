"use client";

import { category_details_api, category_edit_api, category_list_api, category_list_dashboard_api, coupons_detail_api, coupons_detail_dashoard_api, edit_coupons_api, list_store_api, list_store_dashboard_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import { RootState } from "@/redux-store/redux_store";
import TextEditor from "@/app/dashboard/_components/TextEditor";
import UploadImageGetLink from "@/app/dashboard/_components/Upload_image_get_link";
import DateTimePicker from "react-datetime-picker";



const EditCoupons: React.FC = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const pathname = usePathname();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
 const [formData, setFormData] = useState({
     title:"",
     code: "",
     discount: "",
     expiry_date:  new Date(),
     store: { name: "", _id: "" }, 
     category: { name: "", _id: "" },
     status: "",
   });
  const [editorContent, setEditorContent] = useState("");
 const [categoryList, setCategoryList] = useState<
    { name: string; _id: string }[]
  >([]);
  const [storeList, setStoreList] = useState<{ name: string; _id: string }[]>(
    []
  );


  const urlslug = pathname.split("/").pop() || "";


  const getCoupondetail = async () => {
    try {
      const { data } = await axios.post(
        coupons_detail_dashoard_api,
        { coupon_id: urlslug },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );


      console.log(data)

      setFormData({
        title: data.data.title || '',
        code: data.data.code || '',
        discount: data.data.discount || '',
        expiry_date: data.data.expiry_date,
        store: data.data.store || {},
        category: data.data.category || {},
        status: data.data.status || '',
      })
      setEditorContent(data.data.description)

    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Error fetching category");
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };


  useEffect(()=>{
    getCoupondetail()
  },[])


 

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

        setStoreList(storeRes.data.data || []);
        setCategoryList(categoryRes.data.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData()
  
  }, [token]);





   // Handle Submit
  const handleSubmit = async () => {
   
    try {
      const { data } = await axios.post(
        edit_coupons_api,
        {
          coupon_id: urlslug,
          title:formData.title,
          code: formData.code,
          discount: formData.discount,
          expiry_date:  formData.expiry_date,
          store: formData.store._id,
          category: formData.category._id,
          status: formData.status,
          description:editorContent
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("couon updated successfully! Redirecting...");
      setTimeout(() => router.push("/dashboard/all-coupons"), 3000);

    } catch (error) {

     
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Error fetching category");
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        Edit Coupons
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
                value={formData.store._id}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              >
                <option disabled value="">
                  Select Store
                </option>
                {storeList.map((item, i) => (
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
                value={formData.category._id}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              >
                <option disabled value="">
                  Select Category
                </option>
                {categoryList.map((item, i) => (
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
                <option value="REMOVED">REMOVED</option>
              </select>
            </div>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Coupon Description
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

export default EditCoupons;
