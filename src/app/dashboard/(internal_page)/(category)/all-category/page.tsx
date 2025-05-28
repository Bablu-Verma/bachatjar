"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { category_list_api, category_list_dashboard_api } from "@/utils/api_url";
import { ICategory } from "@/common_type";

const CategoryList = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const [categoryList, setCategoryList] = useState([]);
 const [showFilter, setShowFilter] = useState(false);


  const [filters, setFilters] = useState({
     name: "",
     status: "ACTIVE",
     startDate: "",
     endDate: "",
   });

  const getCategory = async () => {
    try {
      const { data } = await axios.post(
        category_list_dashboard_api, filters,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategoryList(data.data);
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
  }, []);

 

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
        All Category
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
            placeholder="Category name"
            value={filters.name}
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
            <option value="">ALL</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="REMOVED">REMOVED</option>
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
                  Status
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Slug
                </th>

               
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {categoryList.map((item:ICategory, i) => (
                <tr key={i} className="bg-white hover:bg-gray-100">
                  <td className="px-6 py-4">
                    <img
                      src={item.imges[0]}
                      alt={item.name}
                      className="w-10 h-10 rounded-md"
                    />
                  </td>

                  <td className="px-6 py-4  ">
                    <span className="text-gray-800">{item.name}</span>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    <span
                      className={`px-2 py-1 text-sm text-white rounded-md ${
                        item.status == true ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-800">{item.slug}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/category/${item.slug}`}
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
      </div>
    </>
  );
};

export default CategoryList;
