/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { RootState } from "@/redux-store/redux_store";
import { users_details_admin } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";

const AdminProfile = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const pathname = usePathname();
  const urlslug = pathname.split("/").pop() || "";

  const [userData, setUserData] = useState({
    details: {} as any,
    order: [] as any[],
    user_upi: [] as any[],
    user_claim_form: [] as any[],
    user_withdrawal_request: [] as any[],
    conform_amount: {} as any,
  });

  const getUserDetails = async () => {
    try {
      const { data } = await axios.post(
        users_details_admin,
        { email: urlslug },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUserData({
        details: data.data.details,
        order: data.data.order,
        user_upi: data.data.user_upi,
        user_claim_form: data.data.user_claim_form,
        user_withdrawal_request: data.data.user_withdrawal_request,
        conform_amount: data.data.conform_amount,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Error fetching user details");
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  useEffect(() => {
    getUserDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!userData.details || Object.keys(userData.details).length === 0) {
    return <p className="text-center text-gray-500">Loading user details...</p>;
  }

  const renderObjectTable = (obj: any) => (
    <table className="w-full border border-gray-300 rounded-md overflow-hidden mb-6">
      <thead>
        <tr className="bg-gray-200">
          {Object.keys(obj).map((key) => (
            <th key={key} className="px-4 py-2 font-semibold text-gray-700 text-left">{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {Object.values(obj).map((value, index) => (
            <td key={index} className="px-4 py-2 text-nowrap text-gray-600">{String(value)}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );

  // Helper function: Check if a value is a valid date
function isValidDate(value: any) {
  const date = new Date(value);
  return !isNaN(date.getTime());
}



function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return String(dateStr); // agar invalid date aaye to original hi dikhao

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,   
  });
}

function formatValue(value: any): string {
  if (typeof value === "string" && value.includes("T") && isValidDate(value)) {
    return formatDateTime(value);
  }
  return String(value);
}

const renderArrayTable = (arr: any[]) => (
  <table className="w-full border border-gray-300 rounded-md overflow-hidden mb-6">
    <thead>
      <tr className="bg-gray-200">
        {arr.length > 0 &&
          Object.keys(arr[0]).map((key) => (
            <th key={key} className="px-4 py-2 font-semibold text-gray-700 text-left">
              {key}
            </th>
          ))}
      </tr>
    </thead>
    <tbody>
      {arr.map((item, idx) => (
        <tr key={idx}>
          {Object.entries(item).map(([, value], index) => (
            <td key={index} className="px-4 py-2 text-nowrap text-gray-600">
              {typeof value === "object" && value !== null
                ? JSON.stringify(value)
                : formatValue(value)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);


  return (
    <div className="p-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">
        Profile ({urlslug})
      </h3>

      {/* Basic Info */}
      <h5 className="text-xl font-semibold text-gray-500 mb-2">Basic Info</h5>
      <div className="max-w-5xl overflow-auto">
        {renderObjectTable(userData.details)}
      </div>

      {/* Address Info */}
      {userData.details?.address && (
        <>
          <h5 className="text-xl font-semibold text-gray-500 mb-2 mt-8">
            Address Info
          </h5>
          <div className="max-w-5xl overflow-auto">
            {renderObjectTable(userData.details.address)}
          </div>
        </>
      )}

      {/* Conform Amount */}
      {userData.conform_amount && Object.keys(userData.conform_amount).length > 0 && (
        <>
          <h5 className="text-xl font-semibold text-gray-500 mb-2 mt-8">
            Confirm Amount
          </h5>
          <div className="max-w-5xl overflow-auto">
            {renderObjectTable(userData.conform_amount)}
          </div>
        </>
      )}

      {/* Orders */}
      {userData.order.length > 0 && (
        <>
          <h5 className="text-xl font-semibold text-gray-500 mb-2 mt-8">
            Orders
          </h5>
          <div className="max-w-5xl overflow-auto">
            {renderArrayTable(userData.order)}
          </div>
        </>
      )}

      {/* User UPI */}
      {userData.user_upi.length > 0 && (
        <>
          <h5 className="text-xl font-semibold text-gray-500 mb-2 mt-8">
            UPI Details
          </h5>
          <div className="max-w-5xl overflow-auto">
            {renderArrayTable(userData.user_upi)}
          </div>
        </>
      )}

      {/* Claim Forms */}
      {userData.user_claim_form.length > 0 && (
        <>
          <h5 className="text-xl font-semibold text-gray-500 mb-2 mt-8">
            Claim Forms
          </h5>
          <div className="max-w-5xl overflow-auto">
            {renderArrayTable(userData.user_claim_form)}
          </div>
        </>
      )}

      {/* Withdrawal Requests */}
      {userData.user_withdrawal_request.length > 0 && (
        <>
          <h5 className="text-xl font-semibold text-gray-500 mb-2 mt-8">
            Withdrawal Requests
          </h5>
          <div className="max-w-5xl overflow-auto">
            {renderArrayTable(userData.user_withdrawal_request)}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminProfile;
