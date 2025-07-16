"use client";

import React, { useEffect, useState } from "react";

import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { report_list_api } from "@/utils/api_url";


import PaginationControls from "@/app/dashboard/_components/PaginationControls";

import { ClientReport } from "@/model/ClientReport";


const EmailList = () => {
    const token = useSelector((state: RootState) => state.user.token);
    const [MessageList, setMessageList] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalpage, setTotalPage] = useState(1)
    const [filters, setFilters] = useState({

        startDate: "",
        endDate: "",
        click_id: "",
        store_id: "",
        report_type: "",

    });

    const getMessage = async () => {
        try {
            const { data } = await axios.post(report_list_api, { ...filters, page: currentPage }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessageList(data.data);
            // console.log(data.data)
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





    return (
        <>
            <h1 className="text-2xl py-2 font-medium text-secondary_color">
                Report List
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
                        name="click_id"
                        placeholder="click_id"
                        value={filters.click_id}
                        onChange={handleFilterChange}
                        className="border p-2 rounded-md h-9 text-sm outline-none "
                    />
                    <input
                        type="text"
                        name="store_id"
                        placeholder="store_id"
                        value={filters.store_id}
                        onChange={handleFilterChange}
                        className="border p-2 rounded-md h-9 text-sm outline-none "
                    />
                    <div className='inline-flex gap-2'>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            report_type
                        </label>
                        <select
                            name="report_type"
                            value={filters.report_type}
                            onChange={handleFilterChange}
                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select</option>
                            <option value="OFFLINE">OFFLINE</option>
                            <option value="PINBACK">PINBACK</option>
                            <option value="MANUAL">MANUAL</option>

                        </select>
                    </div>
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
                                    clieck id
                                </th>
                                <th className="px-6 py-3 text-left font-medium text-gray-700">
                                    store
                                </th>
                                <th className="px-6 py-3 text-left font-medium text-gray-700">
                                    report_type
                                </th>
                                <th className="px-6 min-w-[400px] py-3 text-left font-medium text-gray-700">
                                    Data
                                </th>

                            </tr>
                        </thead>

                        <tbody>
                            {MessageList.map((item: ClientReport, i) => {
                                return (
                                    <tr key={i} className="bg-white hover:bg-gray-100">
                                        <td className="px-6 py-4">{i + 1}</td>
                                        <td className="px-6 py-4 text-nowrap">{item.click_id}</td>
                                        <td className="px-6 py-4 text-nowrap">{item.store.toString()}</td>
                                        <td className="px-6 py-4 text-nowrap">{item.report_type}</td>
                                        <td className="px-6 py-4 text-nowrap">{
                                            <ul className="space-y-1">
                                                {Object.entries(item.raw_data || {}).map(([key, value], idx) => (
                                                    <li key={idx}>
                                                        <strong>{key.replace(/_/g, " ")}:</strong> {String(value)}
                                                    </li>
                                                ))}
                                            </ul>
                                        }</td>

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


