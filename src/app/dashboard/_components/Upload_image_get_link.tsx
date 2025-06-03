"use client";

import { RootState } from "@/redux-store/redux_store";
import { upload_image_api } from "@/utils/api_url";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const UploadImageGetLink = () => {
  const [image, setImage] = useState<File | null>(null);
  const token = useSelector((state: RootState) => state.user.token);
  const [imgLink, setImgLink] = useState("");
  const [loadings, setLoading] = useState(false);

 


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!image) {
        toast.error("Please select an image to upload");
        return;
      }
 
      if (!token) {
        toast.error("Authorization token is missing. Please log in again.");
        return;
      }

      const formPayload = new FormData();

      formPayload.append("image", image);
     

      setLoading(true);
      const { data } = await axios.post(upload_image_api, formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Image uploaded successfully");

      setImgLink(data.url);
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

  return (
    <div className="p-4 rounded-md border border-gray-300">
      <div>
        <div className="flex justify-between items-start">
          <div className="">
            <label
              htmlFor="upimage"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Upload your image & get URL
            </label>
            <input
              type="file"
              id="upimage"
              name="image"
              accept="image/*"
              className=" px-4 py-1 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none"
              onChange={handleImageChange}
            />
            {image && image instanceof File && (
              <div className="flex justify-center items-center mb-6 mt-4">
                <Image
                  src={URL.createObjectURL(image)}
                  alt="Local Image"
                  width={160}
                  height={120}
                  className="h-[120px] w-auto"
                  style={{ height: "120px", width: "auto" }}
                  unoptimized
                />
              </div>
            )}
          </div>
          

          {loadings ? (
            <button
              disabled
              type="button"
              className=" bg-blue-500 text-white text-sm py-2 mt-7 px-4 rounded hover:bg-blue-600"
            >
              Loading..
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              type="button"
              className=" bg-blue-500 text-white text-sm py-2 px-4 mt-7 rounded hover:bg-blue-600"
            >
              Get Link
            </button>
          )}
        </div>


      </div>
      {imgLink && (
        <p className="mt-2 text-green-600">
          Your Image Link:{' '}
          <Link
            href={imgLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {imgLink}
          </Link>
        </p>
      )}
    </div>
  );
};

export default UploadImageGetLink;
