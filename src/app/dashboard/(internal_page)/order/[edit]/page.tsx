"use client";

import { order_detals_admin_api, order_edit_admin_api } from "@/utils/api_url";
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
    payment_status: "",
    payment_details: "",
  });

  const [orderDetails, setOrderDetails] = useState<any>(null);

  const urlslug = pathname.split("/").pop() || "";

  const getOrderdetail = async () => {
    try {
      const { data } = await axios.post(
        order_detals_admin_api,
        { orderId: urlslug },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrderDetails(data.order);
      setFormData({
      
        payment_status: data.order.payment_status || "",
        payment_details:"",
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
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post(
        order_edit_admin_api,
        {
          record_id: urlslug,
          ...formData,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Order updated successfully!");
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
        Edit Order
      </h1>

      {/* SHOW ORDER DETAILS */}
      <div className="max-w-5xl my-5 mx-auto p-5 bg-white border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
        <table className="w-full table-auto text-sm border">
          <tbody>
            <tr className="border-t">
              <td className="p-2 font-semibold">User</td>
              <td className="p-2">{orderDetails.user_id?._id} | {orderDetails.user_id?.name} | ({orderDetails.user_id?.email})</td>
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold">Store</td>
              <td className="p-2">{orderDetails.store_id?._id} | {orderDetails.store_id?.name}</td>
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold">Transaction ID</td>
              <td className="p-2">{orderDetails.transaction_id}</td>
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold">Documant ID</td>
              <td className="p-2">{orderDetails._id}</td>
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold">Redirect URL</td>
              <td className="p-2 break-all">{orderDetails.redirect_url}</td>
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold">Cashback Rate</td>
              <td className="p-2">{orderDetails.cashback_rate}% ({orderDetails.cashback_type})</td>
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold">Upto Amount</td>
              <td className="p-2">₹{orderDetails.upto_amount}</td>
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold">Order Created</td>
              <td className="p-2">{new Date(orderDetails.order_create).toLocaleString()}</td>
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold">Order Value</td>
              <td className="p-2">{orderDetails.order_value}</td>
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold">Pyment Status</td>
              <td className="p-2">{orderDetails.payment_status}</td>
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold"> Calculated Cashback</td>
              <td className="p-2">{orderDetails.cashback}</td>
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
              Payment Status
            </label>
            <select
              name="payment_status"
              value={formData.payment_status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              <option value="Initialize">Initialize</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Details
            </label>
            <input
              type="text"
              name="payment_details"
              value={formData.payment_details}
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
              Update Order
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditOrder;
