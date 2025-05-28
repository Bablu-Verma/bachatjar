"use client";

import { contact_us_update_api } from "@/utils/api_url";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { formatDate } from "@/helpers/client/client_function";



interface EditContactUsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  openSheet: any;
}

const Editcontausus: React.FC<EditContactUsProps> = ({ openSheet }) => {
  const token = useSelector((state: RootState) => state.user.token);

  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: openSheet?.details?.email || "",
    phone_number: openSheet?.details?.phone_number || "",
    subject: openSheet?.details?.subject || "",
    message: openSheet?.details?.message || "",
    name: openSheet?.details?.name || "",
    location: openSheet?.details?.location || "",
    action_status: openSheet?.details?.action_status || "",
  });


  useEffect(() => {
    if (openSheet?.details) {
      setFormData({
        email: openSheet.details.email || "",
        phone_number: openSheet.details.phone_number || "",
        subject: openSheet.details.subject || "",
        message: openSheet.details.message || "",
        name: openSheet.details.name || "",
        location: openSheet.details.location || "",
        action_status: openSheet.details.action_status || "",
      });
    }
  }, [openSheet]);

 


  const handleSubmit = async () => {
   
    try {
      setLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data } = await axios.post(
        contact_us_update_api,
        {
          action_status:formData.action_status,
          id:openSheet.details._id
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Data updated successfully! Redirecting...");
      setTimeout(() => window.location.reload(), 3000);
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

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 
  return (
    <div className=' z-[100] w-full absolute h-[98vh] bg-gray-200 top-0 overflow-auto left-0'>
      <h1 className="text-2xl py-2 ml-5 font-medium text-secondary_color">
        Contact us Details {openSheet.details.email}  
      </h1>
      <div className="max-w-4xl my-10 mx-auto p-5 bg-white border border-gray-50 rounded-lg shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
        >
    
          <h3>{formatDate(openSheet.details.createdAt)}</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
               Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              // onChange={handleInputChange}
              placeholder=" name"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
            subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              // onChange={handleInputChange}
              placeholder="subject"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
            email
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              // onChange={handleInputChange}
              placeholder="email"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
            phone_number
            </label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              // onChange={handleInputChange}
              placeholder="phone"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
            address
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              // onChange={handleInputChange}
              placeholder="location"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
      
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
            action_status
            </label>
            <div className="flex items-center space-x-4">
              <select
                name="action_status"
                value={formData.action_status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              >
                <option disabled value="">
                action_status
                </option>
                <option value="NOTSTART">NOTSTART</option>
                <option value="OPEN">OPEN</option>
                <option value="REMOVED">REMOVED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
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
    </div>
  );
};

export default Editcontausus;
