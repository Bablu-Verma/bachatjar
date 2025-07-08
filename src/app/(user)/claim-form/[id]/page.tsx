"use client";

import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import { RootState } from "@/redux-store/redux_store";
import {
  claim_form_add_api,
  claim_form_tamp_getone_api,
  upload_image_api,
} from "@/utils/api_url";
import { FaSpinner } from "react-icons/fa";
import axios, { AxiosError } from "axios";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import { useEffect, useState } from "react";
import { IClaimField } from "@/model/ClaimFormTemplate";

export default function ClaimForm() {
  const token = useSelector((state: RootState) => state.user.token);
  const pathname = usePathname();
  const urlslug = pathname.split("/").pop() || "";


  const [form_data, setFormData] = useState({
    store_id: urlslug,
    transaction_id: "",
    reason: "",
    dynamic_fields: {} as Record<string, string | string[]>,
  });

  const [dynamicFileInputs, setDynamicFileInputs] = useState<Record<string, File[]>>({});
  const [templateFields, setTemplateFields] = useState<IClaimField[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTemplateByStore = async () => {
    try {
      const { data } = await axios.post(
        claim_form_tamp_getone_api,
        { store: urlslug },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data?.success && data?.data?.fields) {
        setTemplateFields(data.data.fields);
      } else {
        toast.error(data?.message || "No template found.");
      }
    } catch (error) {
      toast.error("Failed to fetch template fields.");
      console.error("Fetch error", error);
    }
  };

  useEffect(() => {
    fetchTemplateByStore();
  }, [urlslug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDynamicChange = (label: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      dynamic_fields: {
        ...prev.dynamic_fields,
        [label]: value,
      },
    }));
  };

  const handleDynamicFileChange = (label: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    setDynamicFileInputs((prev) => ({
      ...prev,
      [label]: Array.from(files),
    }));
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
    const { store_id, reason, transaction_id } = form_data;

    // Base field validation
    if (!store_id || !reason || !transaction_id) {
      toast.error("Please fill all required base fields.");
      return;
    }

    if (reason?.length < 10) {
      toast.error("Reason must be at least 10 characters long");
      return;
    }

    // Validate required dynamic fields
    for (const field of templateFields) {
      const value = form_data.dynamic_fields[field.label];
      const isFileField = field.type === "file";
      const isRequired = field.required;

      if (isRequired) {
        if (isFileField && (!dynamicFileInputs[field.label] || dynamicFileInputs[field.label].length === 0)) {
          toast.error(`Please upload a file for "${field.label}"`);
          return;
        } else if (!isFileField && (!value || value === "")) {
          toast.error(`Please fill the field "${field.label}"`);
          return;
        }
      }
    }

    setIsUploading(true);

    try {
      const dynamicFieldUploads: Record<string, string | string[]> = { ...form_data.dynamic_fields };

      // Upload file inputs and replace with URLs
      for (const label of Object.keys(dynamicFileInputs)) {
        const files = dynamicFileInputs[label];
        if (files.length > 0) {
          const urls = await uploadImages(files);
          dynamicFieldUploads[label] = urls.length === 1 ? urls[0] : urls;
        }
      }

      setIsUploading(false);
      setIsSubmitting(true);

      const response = await axios.post(
        claim_form_add_api,
        {
          ...form_data,
          dynamic_fields: dynamicFieldUploads,
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
            <label className="block font-medium mb-1">Transaction ID <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="transaction_id"
              value={form_data.transaction_id}
              onChange={handleChange}
              placeholder="Transaction ID"
              className="border rounded-md p-2 w-full"
            />
            <label className="block font-medium mb-1">Reason <span className="text-red-500">*</span></label>
            <textarea
              name="reason"
              value={form_data.reason}
              onChange={handleChange}
              placeholder="Reason"
              className="border rounded-md p-2 w-full h-24"
            />

            {templateFields.map((field, idx) => (
              <div key={idx}>
                <label className="block font-medium mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>

                {["text", "number", "date"].includes(field.type) && (
                  <input
                    type={field.type}
                    required={field.required}
                    value={form_data.dynamic_fields[field.label] || ""}
                    onChange={(e) => handleDynamicChange(field.label, e.target.value)}
                    className="border rounded-md p-2 w-full"
                  />
                )}

                {field.type === "file" && (
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    multiple={false}
                    required={field.required}
                    onChange={(e) => handleDynamicFileChange(field.label, e.target.files)}
                    className="border rounded-md p-2 w-full"
                  />
                )}
              </div>
            ))}

            <div className="flex justify-center items-center pt-5">
              <button
                onClick={sendClaimForm}
                disabled={isUploading || isSubmitting}
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
