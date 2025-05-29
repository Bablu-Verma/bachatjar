/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { withdrwal_editstatus_admin_api, withdrwal_request_details_admin_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import { RootState } from "@/redux-store/redux_store";

const EditOrder: React.FC = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const pathname = usePathname();
  const router = useRouter();

  const [formData, setFormData] = useState({
    status: "",
    details: "",
  });

  const [orderDetails, setOrderDetails] = useState<any>(null);

  const urlslug = pathname.split("/").pop() || "";

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getOrderdetail = async () => {
    try {
      const { data } = await axios.post(
        withdrwal_request_details_admin_api,
        { withdrawal_id: urlslug },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log(data)
      setOrderDetails(data.data);
      setFormData({
        status: data.data.status || "",
        details:"",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Error fetching order details");
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    getOrderdetail();
  }, [getOrderdetail]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data } = await axios.post(
        withdrwal_editstatus_admin_api,
        {
          withdrawal_id:urlslug, new_status:formData.status, details :formData.details ,
          
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Withdrwal updated successfully!");
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Error updating order");
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  if (!orderDetails) {
    return <div className="text-center py-10">Loading order details...</div>;
  }

  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        Edit Widthdrawal
      </h1>

      {/* SHOW ORDER DETAILS */}
      <div className="max-w-5xl my-5 mx-auto p-5 bg-white border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Widthdrawal Details</h2>
        <table className="w-full table-auto text-sm border">
          <tbody>
            <tr className="border-t">
              <td className="p-2 font-semibold">User</td>
              <td className="p-2">{orderDetails.user_id?._id} | {orderDetails.user_id?.name} | ({orderDetails.user_id?.email})</td>
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold">Upi</td>
              <td className="p-2">{orderDetails.upi_id} </td>
            </tr>
           
            <tr className="border-t">
              <td className="p-2 font-semibold"> Amount</td>
              <td className="p-2">₹{orderDetails.amount}</td>
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold">request Created</td>
              <td className="p-2">{new Date(orderDetails.createdAt).toLocaleString()}</td>
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold">Status</td>
              <td className="p-2">{orderDetails.status}</td>
            </tr>
          
          </tbody>
        </table>
      </div>

      {/* EDIT FORM */}
      <div className="max-w-4xl my-10 mx-auto p-5 bg-white border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Edit Fields</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
        >
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
              <option value="">Select</option>
            
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
         
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
               Details
            </label>
            <input
              type="text"
              name="details"
              value={formData.details}
              onChange={handleInputChange}
              placeholder="Payment details"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

        
         

          <div className="text-right">
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-500 rounded-lg shadow-lg"
            >
              Update request
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditOrder;
