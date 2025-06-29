"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { manual_report_add_api } from "@/utils/api_url";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";

const AddOfflineManualReport = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    click_id: "",
    order_id: "",
    order_status: "",
    product_name: "",
    order_amount: "",
    commission_earned: "",
    order_date: "",
    reporttype: "initial",
  });

  const token = useSelector((state: RootState) => state.user.token);

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    const {
      click_id,
      order_id,
      order_status,
      product_name,
      order_amount,
      commission_earned,
      order_date,
      reporttype,
    } = formData;

    if (
      !click_id.trim() ||
      !order_id.trim() ||
      !order_status.trim() ||
      !product_name.trim() ||
      !order_amount ||
      !commission_earned ||
      !order_date ||
      !reporttype
    ) {
      toast.error("Please fill in all fields.");
      setLoading(false);
      return;
    }


    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(manual_report_add_api, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(res.data.message);
      toast.success(res.data.message || "Report submitted successfully.");

      // Reset form
      setFormData({
        click_id: "",
        order_id: "",
        order_status: "",
        product_name: "",
        order_amount: "",
        commission_earned: "",
        order_date: "",
        reporttype: "initial",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">Add Manual Report</h1>
      <div className="max-w-4xl my-10 mx-auto p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Click ID</label>
              <input
                type="text"
                name="click_id"
                value={formData.click_id}
                onChange={inputHandler}
                required
                className="w-full px-4 py-2 border rounded-lg shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Order ID</label>
              <input
                type="text"
                name="order_id"
                value={formData.order_id}
                onChange={inputHandler}
                required
                className="w-full px-4 py-2 border rounded-lg shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Order Status</label>
              <input
                type="text"
                name="order_status"
                value={formData.order_status}
                onChange={inputHandler}
                placeholder="e.g., PENDING, DELIVERED"
                required
                className="w-full px-4 py-2 border rounded-lg shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Product Name</label>
              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={inputHandler}
                className="w-full px-4 py-2 border rounded-lg shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Order Amount</label>
              <input
                type="number"
                name="order_amount"
                value={formData.order_amount}
                onChange={inputHandler}
                required
                className="w-full px-4 py-2 border rounded-lg shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Commission Earned</label>
              <input
                type="number"
                name="commission_earned"
                value={formData.commission_earned}
                onChange={inputHandler}
                required
                className="w-full px-4 py-2 border rounded-lg shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Order Date</label>
              <input
                type="date"
                name="order_date"
                value={formData.order_date}
                onChange={inputHandler}
                required
                className="w-full px-4 py-2 border rounded-lg shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Report Type</label>
              <select
                name="reporttype"
                value={formData.reporttype}
                onChange={inputHandler}
                className="w-full px-4 py-2 border rounded-lg shadow-sm"
              >
                <option value="initial">Initial</option>
                <option value="followup">Follow-up</option>
              </select>
            </div>
          </div>

          <div className="text-right pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 text-white rounded-lg shadow-lg ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
                }`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>

        {message && (
          <p className="text-green-600 text-sm mt-4 font-medium">{message}</p>
        )}
      </div>
    </>
  );
};

export default AddOfflineManualReport;
