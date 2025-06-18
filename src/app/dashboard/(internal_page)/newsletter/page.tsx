"use client";

import React, { useEffect, useState } from "react";

import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import {  newsletter_delete_api, newsletter_get_api } from "@/utils/api_url";
import PaginationControls from "../../_components/PaginationControls";

import { INewsletter } from "@/model/Newsletter";


const EmailList = () => {
    const token = useSelector((state: RootState) => state.user.token);
    const [emailList, setEmailList] = useState([]);
    const [showFilter, setShowFilter] = useState(false);


    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalpage, setTotalPage] = useState(1)
    const [filters, setFilters] = useState({
        unsubscribe: "",
        email: "",
        startDate: "",
        endDate: "",
    });

    const getEmail = async () => {
        try {
            const { data } = await axios.post(newsletter_get_api, { ...filters, page: currentPage }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEmailList(data.data);
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
        getEmail();
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


    const delete_email = async (email:string)=>{
  try {
            await axios.post(newsletter_delete_api, { email:email }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
          toast.success('Email delete success')
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error("Error ", error.response?.data.message);
                toast.error(error.response?.data.message);
            } else {
                console.error("Unknown error", error);
            }
        }
    }



    return (
        <>
            <h1 className="text-2xl py-2 font-medium text-secondary_color">
                Newsletter
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
                        type="email"
                        name="email"
                        placeholder="email"
                        value={filters.email}
                        onChange={handleFilterChange}
                        className="border p-2 rounded-md h-9 text-sm outline-none "
                    />

                    <select
                        name="unsubscribe"
                        value={filters.unsubscribe}
                        onChange={handleFilterChange}
                        className="border p-2 rounded-md h-9 text-sm outline-none "
                    >
                        <option value={"true"}>True</option>
                        <option value={"false"}>False</option>
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
                        onClick={getEmail}
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
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left font-medium text-gray-700">
                                    unsubscribe
                                </th>
                                <th className="px-6 py-3 text-left font-medium text-gray-700">
                                    Create Date
                                </th>
                                <th className="px-6 py-3 text-left font-medium text-gray-700">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {emailList.map((item: INewsletter, i) => {
                                return (
                                    <tr key={i} className="bg-white hover:bg-gray-100">
                                        <td className="px-6 py-4">{i + 1}</td>
                                        <td className="px-6 py-4 text-nowrap">{item.email}</td>
                                        <td className="px-6 py-4">{item.unsubscribe}</td>
                                        <td className="px-6 py-4"> 
                                            {new Date(item.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <button
                                               type="button"
                                               onClick={()=>delete_email(item.email)}
                                                className="px-2 text-nowrap py-1 text-sm inline-block text-blue-500 hover:underline"
                                            >
                                                Delete email
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>


                    </table>
                </div>

                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalpage}
                    onPageChange={setCurrentPage}
                />

            </div>
            <div>

            </div>
        </>
    );
};

export default EmailList;


