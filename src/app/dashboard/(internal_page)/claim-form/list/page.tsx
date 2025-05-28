"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { claim_form_list_api } from "@/utils/api_url";
import { formatDate } from "@/helpers/client/client_function";
import PaginationControls from "@/app/dashboard/_components/PaginationControls";

interface ClaimFormItem {
  _id: string;
  createdAt: Date;
  user_id: {
    name: string;
    _id: string;
  };
  status: string;
  store_id: {
    name: string;
    _id: string;
  };
  reason: string;
}

const ContactUsList = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const [userList, setUserList] = useState<ClaimFormItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalpage, setTotalPage] = useState(1)
  const [showFilter, setShowFilter] = useState(false);
  const [, setOpenSheet] = useState({
    show: false,
    details: {},
  });
  const [filters, setFilters] = useState({
    transaction_id: '',
    start_date: '',
    end_date: "",
    CLAIM_STATUSES: "",
    partner_site_orderid: "",
  });

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

  const getList = async () => {
    try {
      const { data } = await axios.post(
        claim_form_list_api,
        { ...filters, page: currentPage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserList(data.data);
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
    getList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  console.log(userList)


  return (
    <div className="relative">
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        Calim form list
      </h1>
      {/* {openSheet.show && (
        <Editcontausus setOpenSheet={setOpenSheet} openSheet={openSheet} />
      )} */}
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
            name="transaction_id"
            placeholder=" transaction_id"
            value={filters.transaction_id}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          />
          <input
            type="text"
            name="partner_site_orderid"
            placeholder="partner_site_orderid"
            value={filters.partner_site_orderid}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          />

          <input
            type="text"
            name="start_date"
            placeholder="start_date"
            value={filters.start_date}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          />

          <input
            type="text"
            name="phone_number"
            placeholder="phone_number"
            value={filters.end_date}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          />

          <select
            name="CLAIM_STATUSES"
            value={filters.CLAIM_STATUSES}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          >
            <option disabled>CLAIM_STATUSES</option>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>

          <button
            onClick={getList}
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
                <th className="px-2 py-3 text-left font-medium text-gray-700">
                  S.NO
                </th>
                <th className="px-2 py-3 text-left font-medium text-gray-700">
                  Date
                </th>
                <th className="px-2 py-3 text-left font-medium text-gray-700">
                 user_id
                </th>

                <th className="px-2 py-3 text-left font-medium text-gray-700">
                status
                </th>
                <th className="px-2 py-3 text-left font-medium text-gray-700">
                store_id
                </th>
                <th className="px-2 py-3 text-left font-medium text-gray-700">
                reason
                </th>
               
                <th className="px-2 py-3 text-left font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {userList.map((item, i) => (
                <tr key={i} className="bg-white hover:bg-gray-100">
                  <td className="px-2 py-4  ">
                    <span className="text-gray-800">{i + 1}.</span>
                  </td>
                  <td className="px-2 py-4  ">
                    <span className="text-gray-800 text-sm">
                      {formatDate(item.createdAt)} { }
                    </span>
                  </td>
                  <td className="px-2 py-4  ">
                    <span className="text-gray-800">
                    {item.user_id.name} <br />
                      {item.user_id._id}</span>
                  </td>

                  <td className="px-2 py-4  ">
                    <span className="text-gray-800">{item.status}</span>
                  </td>

                  <td className="px-2 py-4  ">
                    <span className="text-gray-800">{item.store_id.name}
                      <br />
                      {item.store_id._id}
                    </span>
                  </td>
                  <td className="px-2 py-4  ">
                    <span className="text-gray-800">{item.reason}</span>
                  </td>
                  
                  <td className="px-2 py-4  ">
                    <button
                      onClick={() =>
                        setOpenSheet({
                          show: true,
                          details: item,
                        })
                      }
                    >
                      View details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalpage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ContactUsList;
