"use client";

import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";


import { RootState } from "@/redux-store/redux_store";
import { claim_form_add_api } from "@/utils/api_url";
import { FaImage } from "react-icons/fa";
import axios, { AxiosError } from "axios";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { IoMdClose } from "react-icons/io";
import { useRef, useState } from "react";
import Image from "next/image";

export default function ClaimForm() {
  const token = useSelector((state: RootState) => state.user.token);
  const pathname = usePathname();
  const urlslug = pathname.split("/").pop() || "";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form_data, setFormData] = useState({
    store_id: urlslug,
    transaction_id: "",
    reason: "",
    partner_site_orderid: "",
    partner_site_order_status: "",
    product_order_date: "",
    product_delever_date: "",
    order_value: "",
    supporting_documents: [] as File[],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // For selecting file
  const handleAddImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        supporting_documents: [...prev.supporting_documents, selectedFile],
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      supporting_documents: prev.supporting_documents.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const sendClaimForm = async () => {
    const {
        store_id,
        transaction_id,
        reason,
        partner_site_orderid,
        partner_site_order_status,
        product_order_date,
        order_value,
        supporting_documents,
      } = form_data;
    
      if (
        !store_id ||
        !transaction_id ||
        !reason ||
        !partner_site_orderid ||
        !partner_site_order_status ||
        !product_order_date ||
        !order_value
      ) {
        toast.error("Please fill all fields before submitting.");
        return;
      }

      if (supporting_documents.length === 0) {
        toast.error("Please upload at least one supporting document.");
        return;
      }
    
      if (supporting_documents.length > 3) {
        toast.error("You can upload a maximum of 3 images.");
        return;
      }

    const body = new FormData();
    body.append("store_id", form_data.store_id);
    body.append("transaction_id", form_data.transaction_id);
    body.append("reason", form_data.reason);
    body.append("partner_site_orderid", form_data.partner_site_orderid);
    body.append(
      "partner_site_order_status",
      form_data.partner_site_order_status
    );
    body.append("product_order_date", form_data.product_order_date);
    body.append("product_delever_date", form_data.product_delever_date);
    body.append("order_value", form_data.order_value);

    form_data.supporting_documents.forEach((file) => {
      body.append("supporting_documents", file);
    });

    try {
      const { data } = await axios.post(claim_form_add_api, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(data.message || "Claim submitted successfully!");
      setTimeout(()=>{
        window.location.reload()
      },3000)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error ", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  return (
    <>
    
      <MainHeader />
      <main>
        <div className="max-w-2xl mx-auto p-8 bg-white my-10 rounded-lg">
          <h1 className="text-2xl font-bold mb-6">Claim Form</h1>
          <div className="grid gap-6">
            <input
              type="text"
              name="store_id"
              readOnly
              value={form_data.store_id}
              placeholder="Store ID"
              className="border rounded-md p-2 w-full"
            />
            <input
              type="text"
              name="transaction_id"
              value={form_data.transaction_id}
              onChange={handleChange}
              placeholder="Transaction ID"
              className="border rounded-md p-2 w-full"
            />
            <textarea
              name="reason"
              value={form_data.reason}
              onChange={handleChange}
              placeholder="Reason"
              className="border rounded-md p-2 w-full h-24"
            />
             <input
              type="text"
              name="partner_site_orderid"
              value={form_data.partner_site_orderid}
              onChange={handleChange}
              placeholder="Partner Site Order ID"
              className="border rounded-md p-2 w-full"
            />
            <div className="grid grid-cols-2 gap-5">
           
             <input
              type="number"
              name="order_value"
              value={form_data.order_value}
              onChange={handleChange}
              placeholder="Order Value"
              className="border rounded-md p-2 w-full"
            />
             <input
              type="text"
              name="partner_site_order_status"
              value={form_data.partner_site_order_status}
              onChange={handleChange}
              placeholder="Partner Site Order Status"
              className="border rounded-md p-2 w-full"
            />
            </div>
           

           
            <div className="grid grid-cols-2 gap-5">
            <div>
            <label className="text-sm">Product Order Date</label>
            <input
              type="date"
              name="product_order_date"
              value={form_data.product_order_date}
              onChange={handleChange}
              className="border rounded-md p-2 w-full"
            />
            </div>
           <div>
           <label className="text-sm">Product Delever Date</label>
           <input
              type="date"
              name="product_delever_date"
              value={form_data.product_delever_date}
              onChange={handleChange}
              className="border rounded-md p-2 w-full"
            />
           </div>
            </div>
            
           
            <div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={handleAddImage}
                className=" border rounded-md p-2 w-full  py-2 px-4 flex justify-center items-center gap-3  hover:bg-gray-100 transition"
              > <FaImage className="text-lg" />
                <span>Add Image</span>
              </button>
            </div>

            {/* File Upload */}
            <div>
              {form_data.supporting_documents.length > 0 && (
                <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {form_data.supporting_documents.map((file, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt="Uploaded Preview"
                        width={200}
                        height={96}
                        className="w-full h-24 object-cover rounded-md"
                        style={{ objectFit: "cover", borderRadius: "0.375rem" }}
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 flex justify-center items-center text-sm text-white rounded-full h-5 w-5 hover:text-secondary"
                      >
                       <IoMdClose className="text-base" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
<div className="flex justify-center items-center pt-5">
<button
              onClick={sendClaimForm}
              className="bg-primary max-w-[250px] text-white py-2 px-12 rounded-md hover:text-secondary transition"
            >
              Submit Claim
            </button>
</div>
           
          </div>
        </div>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
}
