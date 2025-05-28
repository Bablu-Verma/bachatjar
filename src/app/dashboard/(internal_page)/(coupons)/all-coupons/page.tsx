"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { blog_category_dashboard_list_api, category_list_api, coupons_list_api, coupons_list_dashboard_api, list_store_api, list_store_dashboard_api } from "@/utils/api_url";
import { ICategory } from "@/common_type";
import { ICoupon } from "@/model/CouponModel";
import PaginationControls from "@/app/dashboard/_components/PaginationControls";

const CategoryList = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const [couponsList, setCouponsList] = useState([]);
 const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalpage, setTotalPage] = useState(1)
  const [storeList, setStoreList] = useState<{ name: string; _id: string }[]>(
    []
  );

  const [filters, setFilters] = useState({
    status:"ACTIVE" , // "ACTIVE" | "INACTIVE" | "REMOVED" | "ALL"
    store:"",
    startDate:"",
    endDate:"",
    code:""
   });

  const getCoupons = async () => {
    try {
      const { data } = await axios.post(
        coupons_list_dashboard_api, {...filters, page:currentPage},
        {
          headers: {
           
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTotalPage(data.pagination.totalPages)
      setCouponsList(data.data);
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
    getCoupons();
  }, [currentPage]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storeRes] = await Promise.all([
          axios.post(
            list_store_dashboard_api,
            { store_status: "ACTIVE" },
            { headers: { Authorization: `Bearer ${token}` } }
          ),
         
        ]);
        setStoreList(storeRes.data.data || []);
      
      } catch (error) {
        console.log(error);
      }
    };
    if (showFilter) {
      fetchData();
    }
  }, [token, showFilter]);

 

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
        All Coupons
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
            name="code"
            placeholder="coupon code"
            value={filters.code}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          />
         
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          >
            <option disabled>Category status</option>
            <option value="ALL">ALL</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="REMOVED">REMOVED</option>
          </select>

         
          <select
            name="store"
            value={filters.store}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          >
            <option disabled>Store</option>

            {storeList.map((item, i) => {
              return (
                <option key={i} value={item._id}>
                  {item.name}
                </option>
              );
            })}
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
            onClick={getCoupons}
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
                  Name
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Code
                </th>

                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                discount
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Store
                </th>
              
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {couponsList.map((item:ICoupon, i) => (
                <tr key={i} className="bg-white hover:bg-gray-100">
                 
                 <td className="px-6 py-4  ">
                    <span className="text-gray-800">{item.title}</span>
                  </td>
                  <td className="px-6 py-4  ">
                    <span className="text-gray-800">{item.code}</span>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                  {item.status}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-800">{item.discount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-800">{item?.store?.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/coupons/${item._id}`}
                      className="px-2 py-1 text-sm inline-block text-blue-500 hover:underline"
                    >
                      Edit
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
    </>
  );
};

export default CategoryList;
