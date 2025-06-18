"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { all_image_api, image_delete_api } from "@/utils/api_url";
import Image from "next/image";

interface ImageItem {
  filename: string;
  url: string;
}

const ShowAllImageList = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const [imageList, setImageList] = useState<ImageItem[]>([]);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());

  const getImageList = async () => {
    try {
      const { data } = await axios.post(all_image_api,{}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log(data)
      setImageList(data.images); // assumes { images: [...] }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Failed to load images.");
      } else {
        toast.error("Unknown error occurred.");
      }
    }
  };

  const handleCheckboxToggle = (filename: string) => {
    setSelectedImages((prev) => {
      const copy = new Set(prev);
      if (copy.has(filename)) copy.delete(filename);
      else copy.add(filename);
      return copy;
    });
  };

  const deleteSelectedImages = async () => {
    if (selectedImages.size === 0) {
      toast.error("No images selected.");
      return;
    }

    const confirm = window.confirm("Are you sure you want to delete selected images?");
    if (!confirm) return;

    try {
      const { data } = await axios.post(
        image_delete_api, 
        {
          filenames: Array.from(selectedImages),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message || "Images deleted.");
      setSelectedImages(new Set());
      getImageList(); 
    } catch (error) {
      toast.error("Failed to delete images.");
      console.error(error);
    }
  };

  useEffect(() => {
    getImageList();
    
  }, []);

  return (
    <div className="relative">
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        All Images
      </h1>

      <div className="mb-4 flex justify-end">
        <button
          onClick={deleteSelectedImages}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
        >
          Delete Selected {selectedImages.size} Images
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {imageList.map((item, i) => (
          <div key={i} className="relative border p-2 rounded shadow">
            <Image
              src={item.url}
              alt={item.filename}
              width={100}
              height={100}
              className="w-full h-32 object-cover rounded"
            />
            <h3 className="text-sm truncate">{item.filename}</h3>
            <input
              type="checkbox"
              className="absolute top-2 right-2 w-5 h-5"
              checked={selectedImages.has(item.filename)}
              onChange={() => handleCheckboxToggle(item.filename)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowAllImageList;
