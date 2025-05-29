"use client";

import {
  category_details_dashboard_api,
  category_edit_api,
} from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import TextEditor from "@/app/dashboard/_components/TextEditor";
import UploadImageGetLink from "@/app/dashboard/_components/Upload_image_get_link";
import Image from "next/image";

const EditCategory: React.FC = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const pathname = usePathname();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    categoryName: "",
    images: ["", ""],
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });
  const [editorContent, setEditorContent] = useState("");
  const urlslug = pathname.split("/").pop() || "";

  const getCategory = async () => {
    try {
      const { data } = await axios.post(
        category_details_dashboard_api,
        { slug: urlslug },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const category_details = data.data.category_details;

      // console.log(category_details);

      setFormData({
        categoryName: category_details.name || "",
        images: category_details.imges || ["", ""],
        status: category_details.status || "ACTIVE",
      });
      setEditorContent(category_details.description);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Error fetching category");
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    getCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlslug]);

  // Handle Submit
  const handleSubmit = async () => {
    const { categoryName, status, images } = formData;

    try {
      setLoading(true);
      await axios.post(
        category_edit_api,
        {
          slug: urlslug,
          name: categoryName,
          description: editorContent,
          status: status,
          imges: images,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Category updated successfully! Redirecting...");
      setTimeout(() => router.push("/dashboard/all-category"), 3000);
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "innerImage") {
      setFormData((prev) => ({ ...prev, images: [value, prev.images[1]] }));
    } else if (name === "outerImage") {
      setFormData((prev) => ({ ...prev, images: [prev.images[0], value] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const renderImagePreview = (index: number) => {
    return formData.images[index] ? (
      <Image
        unoptimized
        src={formData.images[index]}
        alt={`Category image ${index + 1}`}
        width={96}
        height={96}
        className="w-24 h-24 object-cover rounded-md"
        style={{ objectFit: "cover", borderRadius: "0.375rem" }}
      />
    ) : null;
  };

  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        Edit Category
      </h1>
      <div className="max-w-4xl my-10 mx-auto p-5 bg-white border border-gray-50 rounded-lg shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
        >
          <UploadImageGetLink />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name
            </label>
            <input
              type="text"
              name="categoryName"
              value={formData.categoryName}
              onChange={handleInputChange}
              placeholder="Enter category name"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inner Category Image URL
              </label>
              <input
                type="text"
                name="innerImage"
                value={formData.images[0]}
                onChange={handleInputChange}
                placeholder="Enter inner image URL"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-4 flex space-x-4">{renderImagePreview(0)}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Outer Category Image URL
              </label>
              <input
                type="text"
                name="outerImage"
                value={formData.images[1]}
                onChange={handleInputChange}
                placeholder="Enter outer image URL"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-4 flex space-x-4">{renderImagePreview(1)}</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Status
            </label>
            <div className="flex items-center space-x-4">
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              >
                <option disabled value="">
                  Select Store
                </option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Description
            </label>
            <TextEditor
              editorContent={editorContent}
              setEditorContent={setEditorContent}
            />
          </div>

          <div className="text-right">
            <button
              type="reset"
              className="px-6 py-2 text-red-500 rounded-lg shadow-lg font-medium focus:ring-2 focus:ring-red-500 mr-6"
              onClick={() => window.location.reload()}
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
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
