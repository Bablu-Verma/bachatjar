"use client";

import React, { useEffect, useState } from "react";

import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { message_delete_api, message_list_api} from "@/utils/api_url";


import PaginationControls from "@/app/dashboard/_components/PaginationControls";
import { IMessage } from "@/model/Message";


const EmailList = () => {
    const token = useSelector((state: RootState) => state.user.token);
    const [MessageList, setMessageList] = useState([]);
    const [showFilter, setShowFilter] = useState(false);


    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalpage, setTotalPage] = useState(1)
    const [filters, setFilters] = useState({
        title: "",
        userId: "",
        startDate: "",
        endDate: "",
    });

    const getMessage = async () => {
        try {
            const { data } = await axios.post(message_list_api, { ...filters, page: currentPage }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessageList(data.data);
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
        getMessage();
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


    const delete_message = async (id: string) => {
        try {
             await axios.post(message_delete_api, { messageId: id }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Message delete success')
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
                Message List
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
                        name="userId"
                        placeholder="userId"
                        value={filters.userId}
                        onChange={handleFilterChange}
                        className="border p-2 rounded-md h-9 text-sm outline-none "
                    />
                    <input
                        type="text"
                        name="title"
                        placeholder="title"
                        value={filters.title}
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
                    to
                    <input
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        className="border p-2 rounded-md h-9 text-sm outline-none "
                    />
                    <button
                        onClick={getMessage}
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
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left font-medium text-gray-700">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left font-medium text-gray-700">
                                    Create Date
                                </th>
                                <th className="px-6 min-w-[400px] py-3 text-left font-medium text-gray-700">
                                    Body
                                </th>
                                <th className="px-6 py-3 text-left font-medium text-gray-700">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {MessageList.map((item: IMessage, i) => {
                                return (
                                    <tr key={i} className="bg-white hover:bg-gray-100">
                                        <td className="px-6 py-4">{i + 1}</td>
                                        <td className="px-6 py-4 text-nowrap">{item.title}</td>
                                        
                                        <td className="px-6 py-4">
                                        
                                            {item.userId._id.toString()} <br />
                                          {/* @ts-expect-error expected error due to type mismatch */}
                                            {item.userId.email} <br />
                                           {/* @ts-expect-error expected error due to type mismatch */}
                                            {item.userId.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(item.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 min-w-[400px]">{item.body}</td>
                                        <td className="px-6 py-4">

                                            <button
                                                type="button"

                                                onClick={() => delete_message(item._id.toString())}
                                                className="px-2 text-nowrap py-1 text-sm inline-block text-blue-500 hover:underline"
                                            >
                                                Delete Message
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


