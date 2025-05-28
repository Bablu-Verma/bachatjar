"use client";

import React, { useEffect, useState } from "react";

import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { order_list_admin_api, withdrwal_list_admin_api } from "@/utils/api_url";
import { IOrder } from "@/model/OrderModel";
import PaginationControls from "../../_components/PaginationControls";
import { formatDate } from "@/helpers/client/client_function";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import { IWithdrawalRequest } from "@/model/WithdrawalRequestModel";


const OrderList = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const [OrderList, setOrderList] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const [sheet, setSheet] = useState({ show: false, details: {} as any });
  const [showPaymentHistory, setShowPaymentHistory] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalpage, setTotalPage] = useState(1)

  const [filters, setFilters] = useState({
    status: "",
    user_id: "",
    startdate: "",
    enddate: "",
  });

  const getOrders = async () => {
    try {
      const { data } = await axios.post(withdrwal_list_admin_api, { ...filters, page: currentPage }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrderList(data.data);
      setTotalPage(data.pagination.totalPages)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error ", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  useEffect(() => {
    getOrders();
  }, [currentPage]);

  console.log(OrderList)

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const updatedFilters = { ...prev, [name]: value };
      // console.log("Updated Filters:", updatedFilters); // Debugging
      return updatedFilters;
    });
  };

  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        All withdrwal request
      </h1>

      <button
        className="border p-2 rounded-md h-9 text-sm outline-none text-blue-300"
        type="button"
        onClick={() => setShowFilter(!showFilter)}
      >
        {showFilter ? "Hide Filter" : "Show Filter"}
      </button>

      {showFilter && (
        <div className="flex mt-3 flex-wrap gap-4 p-4 bg-gray-100 rounded-md">
         
          <input
            type="text"
            name="user_id"
            placeholder="user_id"
            value={filters.user_id}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          >
            <option disabled>status</option>
            <option value="ALL">ALL</option>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>

          <input
            type="date"
            name="startdate"
            value={filters.startdate}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          />

          <input
            type="date"
            name="enddate"
            value={filters.enddate}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          />

          <button
            onClick={getOrders}
            className="border p-2 rounded-md h-9 text-sm outline-none text-white bg-primary"
          >
            Apply Filters
          </button>
        </div>
      )}

      <div className="pt-5 py-5 px-0 relative w-full">
        <div className="overflow-x-auto pb-4">
          <table className="min-w-full table-auto border-collapserounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  S.No.
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  user_id
                </th>
               
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  upi_id / Email
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Amount
                </th>
               
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  status
                </th>

                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Action
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Order Edit
                </th>
              </tr>
            </thead>
            <tbody>
              {OrderList.map((item:IWithdrawalRequest, i) => (
                <tr key={i} className="bg-white hover:bg-gray-100">
                  <td className="px-6 py-4  ">{i + 1}</td>
                  <td className="px-6 py-4  ">
                  {item.user_id._id}  <br />
                  {item.user_id.email}
                  </td>
                 
                  <td className="px-6 py-4  ">{item.upi_id}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {item.amount}
                  </td>
                  
                  <td className="px-6 py-4">{item.status}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => setSheet({ show: true, details: item })} className="">details</button>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/withdrwal/${item._id}`}
                      className="px-2 py-1 text-sm inline-block text-blue-500 hover:underline"
                    >
                      Edit withdrawal
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalpage}
          onPageChange={setCurrentPage}
        />

      </div>

      {sheet.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl relative p-6 animate-slideUp">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
              onClick={() => setSheet({ show: false, details: {} })}
            >
              <IoClose className="text-2xl text-gray-600 hover:text-black" />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-semibold text-primary mb-6 text-center">withdrwal Details</h2>

            {/* Divider */}
            <div className="border-b mb-6"></div>

            {/* Details */}
            <div className="space-y-5">
              <DetailRow label="UPI" value={sheet.details.upi_id || "-"} />
              <DetailRow label="request Date" value={formatDate(sheet.details.createdAt)} />
              <DetailRow label="user id" value={sheet.details.user_id._id} />
              <DetailRow label="user email" value={sheet.details.user_id.email} />
              <DetailRow
                label="Amount"
                value={sheet.details.amount ? `₹ ${sheet.details.amount}` : "-"}
              />
            
            
              <DetailRow label=" Status" value={sheet.details.status ?? "-"} />
              {sheet.details.history && sheet.details.history.length > 0 && (
                <div className="mt-10">
                  <div
                    className="flex justify-between items-center cursor-pointer bg-green-100 px-3 py-2 rounded-lg hover:bg-green-200"
                    onClick={() => setShowPaymentHistory(!showPaymentHistory)}
                  >
                    <h3 className="text-secondary text-base font-medium"> History</h3>
                    <span className="text-gray-600">{showPaymentHistory ? "▲" : "▼"}</span>
                  </div>

                  {showPaymentHistory && (
                    <div className="overflow-x-auto mt-4">
                      <table className="min-w-full text-sm border">
                        <thead className="bg-green-100">
                          <tr>
                            <th className="text-left p-3 border-b">Details</th>
                            <th className="text-left p-3 border-b">Date</th>
                            <th className="text-left p-3 border-b">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sheet.details.history.map((payment, idx) => (
                            <tr key={idx} className="hover:bg-green-50">
                              <td className="p-3 border-b">{payment.details || "-"}</td>
                              <td className="p-3 border-b">{formatDate(payment.date)}</td>
                              <td className="p-3 border-b">{payment.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default OrderList;

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center border-b pb-3">
    <span className="text-gray-500 font-medium capitalize">{label}</span>
    <span className="text-gray-800 font-normal capitalize">{value}</span>
  </div>
);