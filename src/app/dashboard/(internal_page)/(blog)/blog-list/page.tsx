"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import {
  get_All_dashboard_blogs,
} from "@/utils/api_url";
import PaginationControls from "@/app/dashboard/_components/PaginationControls";

import { IBlog } from "@/model/BlogModal";

const BlogList = () => {
  const [blog_list, setBlogList] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalpage, setTotalPage] = useState(1)

  const token = useSelector((state: RootState) => state.user.token);
  const [showFilter, setShowFilter] = useState(false);

  // ✅ Filters state (All filters included)
  const [filters, setFilters] = useState({
    search: "",
    status: "", // "ACTIVE", "INACTIVE", "REMOVED" , 'ALL'
    startDate: "",
    endDate: "",
    sortBy: "views", // views, createdAt
  });

  // ✅ Handle filter change
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const updatedFilters = { ...prev, [name]: value };
      return updatedFilters;
    });
  };

  // ✅ Fetch Products
  const get_blog = async () => {
    try {
      const { data } = await axios.post(get_All_dashboard_blogs, {...filters, page:currentPage}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBlogList(data.data);
      // console.log(data.data)
      setTotalPage(data.pagination.totalPages)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error ", error.response?.data.message);
        toast.error(error.response?.data.message || "An error occurred");
      } else {
        console.error("Unknown error", error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    get_blog();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);


  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        All Blogs
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
            name="search"
            placeholder="Search blog"
            value={filters.search}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          />
       
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          >
            <option disabled>blog status</option>
            <option value="ALL">All</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="REMOVED">REMOVED</option>
          </select>

          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          >
            <option disabled>blog sortBy</option>
            <option value="views">views</option>
            <option value="createdAt">createdAt</option>
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
            onClick={get_blog}
            className="border p-2 rounded-md h-9 text-sm outline-none text-white bg-primary"
          >
            Apply Filters
          </button>
        </div>
      )}

      {/* ✅ Product Table */}
      <div className="pt-5 py-5 px-0 relative w-full">
        <div className="overflow-x-auto pb-4">
          <table className="min-w-full table-auto border-collapse rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left font-medium max-w-[300px] text-gray-700">
                  Name
                </th>

                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Category
                </th>

                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Blog type
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {blog_list.map((item: IBlog, i) => (
                <tr className="bg-white hover:bg-gray-100" key={i}>
                  <td>
                    <Image
                      src={item.image[0]}
                      alt={item.title || "Blog image"}
                      width={40}
                      height={40}
                      className="h-10 w-10"
                    />
                
                    <a className="text-gray-800 text-sm hover:text-blue-400 line-clamp-2">
                      {item.title}
                    </a>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {typeof item.blog_category === "object" && "name" in item.blog_category
                      ? (item.blog_category as { name: string }).name
                      : String(item.blog_category)}
                  </td>

                  <td className="px-6 py-4 text-gray-600">{item.status}</td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.blog_type}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/edit-blog/${item.slug}`}
                      className="px-2 py-1 text-sm text-white bg-yellow-500 rounded-md"
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

export default BlogList;
