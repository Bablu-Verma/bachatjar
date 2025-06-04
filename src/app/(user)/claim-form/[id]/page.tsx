"use client";

import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import { RootState } from "@/redux-store/redux_store";
import { claim_form_add_api, upload_image_api } from "@/utils/api_url";
import { FaImage, FaSpinner } from "react-icons/fa";
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
    supporting_documents: [] as string[], 
  });

  const [tempFiles, setTempFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    
    // Validate number of files
    if (tempFiles.length + files.length > 3) {
      toast.error("You can upload a maximum of 3 images.");
      return;
    }

    // Validate file types
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      toast.error("Only JPG, PNG, and WEBP images are allowed.");
      return;
    }

    setTempFiles(prev => [...prev, ...files]);
  };

  const handleRemoveImage = (index: number) => {
    setTempFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const file of files) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const { data } = await axios.post(upload_image_api, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        uploadedUrls.push(data.url);
      } catch (error) {
        console.error("Error uploading image:", error);
        throw new Error("Failed to upload one or more images");
      }
    }
    
    return uploadedUrls;
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


    if (reason?.length < 10) {
      toast.error("Reason must be at least 10 characters long");
      return;
    }


    if (tempFiles.length === 0) {
      toast.error("Please upload at least one supporting document.");
      return;
    }

    setIsUploading(true);

    try {
      
      const imageUrls = await uploadImages(tempFiles);
      
     
      setIsUploading(false);
      setIsSubmitting(true);
      
      const response = await axios.post(
        claim_form_add_api,
        {
          ...form_data,
          supporting_documents: imageUrls,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message || "Claim submitted successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      setIsUploading(false);
      setIsSubmitting(false);
      
      if (error instanceof AxiosError) {
        console.error("Error ", error.response?.data.message);
        toast.error(error.response?.data.message || "Submission failed");
      } else {
        console.error("Unknown error", error);
        toast.error("An error occurred while submitting the claim");
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
                accept="image/jpeg, image/png, image/webp"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
              />

              <button
                type="button"
                onClick={handleAddImage}
                disabled={isUploading || isSubmitting}
                className="border rounded-md p-2 w-full py-2 px-4 flex justify-center items-center gap-3 hover:bg-gray-100 transition disabled:opacity-50"
              >
                <FaImage className="text-lg" />
                <span>Add Image</span>
              </button>
              <p className="text-xs text-gray-500 mt-1">Max 3 images (JPG, PNG, WEBP)</p>
            </div>

            {/* Preview uploaded images */}
            <div>
              {tempFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {tempFiles.map((file, index) => (
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
                        disabled={isUploading || isSubmitting}
                        className="absolute top-2 right-2 bg-red-500 flex justify-center items-center text-sm text-white rounded-full h-5 w-5 hover:text-secondary disabled:opacity-50"
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
                disabled={isUploading || isSubmitting || tempFiles.length === 0}
                className="bg-primary max-w-[250px] text-white py-2 px-12 rounded-md hover:text-secondary transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {(isUploading || isSubmitting) && (
                  <FaSpinner className="animate-spin" />
                )}
                {isUploading ? "Uploading..." : isSubmitting ? "Submitting..." : "Submit Claim"}
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