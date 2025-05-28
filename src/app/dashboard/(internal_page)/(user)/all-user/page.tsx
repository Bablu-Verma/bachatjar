"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { all_users } from "@/utils/api_url";

import { IUser } from "@/model/UserModel";
import PaginationControls from "@/app/dashboard/_components/PaginationControls";


const UserList = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const [users, setUsers] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalpage, setTotalPage] = useState(1)

  
  const [filters, setFilters] = useState({
    search:"",
    role:"",
    status:'',
    gender:'',
    startDate:"",
    endDate:"",
  });

  const getUsers = async () => {
    try {
      const { data } = await axios.post(all_users, {...filters, page:currentPage}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(data.data);
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
    getUsers();
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

  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        All Users
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
            placeholder="Name / Email "
            value={filters.search}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          />
          

          <select
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          >
            <option disabled>User role</option>
            <option value="user">user</option>
            <option value="admin">admin</option>
            <option value="blog_editor">blog_editor</option>
            <option value="data_editor">data_editor</option>
          </select>

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          >
            <option disabled>user status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="REMOVED">REMOVED</option>
           
          </select>

          <select
            name="gender"
            value={filters.gender}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          >
            <option disabled>gender</option>
            <option value="male">male</option>
            <option value="female">female</option>
            <option value="other">other</option>
           
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
            onClick={getUsers}
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
                  Email
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Role
                </th>

                <th className="px-6 py-3 text-left font-medium text-gray-700">
                user_status
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                Action
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((item: IUser, i) => (
                <tr key={i} className="bg-white hover:bg-gray-100">
                  <td className="px-6 py-4">
                    <span className="text-gray-800">{item.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-800">
                    {item.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-800">{item.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-800">{item.user_status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/user/edit/${item.email}`}
                      className="px-2 py-1 text-sm inline-block text-blue-500 hover:underline"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/dashboard/user/${item.email}`}
                      className="px-2 py-1 text-sm inline-block text-blue-500 hover:underline"
                    >
                      View
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

export default UserList;
