"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { bank_upi_admin_list_api } from "@/utils/api_url";
import { IUserUPI } from "@/model/UserUPIModel";
import PaginationControls from "@/app/dashboard/_components/PaginationControls";

const UPIAdminList = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const [UPIList, setUPIList] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalpage, setTotalPage] = useState(1)


  const [filters, setFilters] = useState({
    user_email: "",
    status: "ACTIVE",
    startDate: "",
    endDate: "",
    upi_id: "",
    upi_holder_name_aspr_upi: "",
  });

  const getupilist = async () => {
    try {
      const { data } = await axios.post(bank_upi_admin_list_api, {...filters, page:currentPage}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTotalPage(data.pagination.totalPages)
      setUPIList(data.data);
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
    getupilist();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const updatedFilters = { ...prev, [name]: value };
    
      return updatedFilters;
    });
  };

  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        All UPI
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
            name="user_email"
            placeholder=" user_email"
            value={filters.user_email}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          />
          <input
            type="text"
            name="upi_id"
            placeholder=" upi_id"
            value={filters.upi_id}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          />
          <input
            type="text"
            name="upi_holder_name_aspr_upi"
            placeholder=" upi_holder_name_aspr_upi"
            value={filters.upi_holder_name_aspr_upi}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          />

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          >
            <option disabled>Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>

          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          />

          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          />

          <button
            onClick={getupilist}
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
                  upi_id
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  user_email
                </th>

                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  upi_holder_name_aspr_upi
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  upi_link_bank_name
                </th>

                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  status
                </th>
              </tr>
            </thead>
            <tbody>
              {UPIList.map((item: IUserUPI, i) => (
                <tr key={i} className="bg-white hover:bg-gray-100">
                  <td className="px-6 py-4  ">{item.upi_id}</td>
                  <td className="px-6 py-4  ">{item.user_email}</td>
                  <td className="px-6 py-4  ">
                    {item.upi_holder_name_aspr_upi}
                  </td>
                  <td className="px-6 py-4  ">{item.upi_link_bank_name}</td>
                  <td className="px-6 py-4  ">{item.status}</td>
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
    </>
  );
};

export default UPIAdminList;
