"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import {
  live_deal_list_admin_api,
  live_dealdeleteone_list_admin_api,
} from "@/utils/api_url";
import { ILiveDeal } from "@/model/LiveDeal";
import PaginationControls from "@/app/dashboard/_components/PaginationControls";
import Image from "next/image";

const CategoryList = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const [categoryList, setCategoryList] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalpage, setTotalPage] = useState(1);

  const [filters, setFilters] = useState({
    name: "",
    source: "",
    startDate: "",
    endDate: "",
  });

  const getCategory = async () => {
    try {
      const { data } = await axios.post(
        live_deal_list_admin_api,
        { ...filters, page: currentPage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(data);
      setCategoryList(data.data);
      setTotalPage(data.pagination.totalPages);
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
    getCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

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

  const delete_deal = async (item: string) => {
    try {
      const { data } = await axios.post(
        live_dealdeleteone_list_admin_api,
        {
          _id: item,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.message || "Delete sucess");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error ", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        All Live Deals
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
            name="name"
            placeholder=" name"
            value={filters.name}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          />
          <input
            type="text"
            name="source"
            placeholder="source"
            value={filters.source}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          />

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
            onClick={getCategory}
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
                  Image
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Name
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  price
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  real price
                </th>

                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Source
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Commition url
                </th>

                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {categoryList.map((item: ILiveDeal, i) => (
                <tr key={i} className="bg-white hover:bg-gray-100">
                  <td className="px-6 py-4">
                    <Image
                      unoptimized
                      src={item.image}
                      alt={item.title}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-md"
                    />
                  </td>

                  <td className="px-6 py-4  ">
                    <span className="text-gray-800 line-clamp-2">
                      {item.title}
                    </span>
                  </td>
                  <td className="px-6 py-4  ">
                    <span className="text-gray-800">{item.price}</span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-gray-800">{item.real_price}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-800">{item.source}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-800 ">{item.client_id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof item._id === "string") {
                          delete_deal(item._id);
                        }
                      }}
                      className="text-red-400 text-base"
                    >
                      Delete
                    </button>
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
    </>
  );
};

export default CategoryList;
