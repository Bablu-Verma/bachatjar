"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { claim_form_edit_api, claim_form_list_api } from "@/utils/api_url";
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

const ClaimFormList = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const [calimList, setClaimList] = useState<ClaimFormItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalpage, setTotalPage] = useState(1)
  const [showFilter, setShowFilter] = useState(false);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [openSheet, setOpenSheet] = useState<{show: boolean; details: any;}>({
    show: false,
    details: {},
  });

  const [filters, setFilters] = useState({
    transaction_id: '',
    user_email: '',
    store_id: '',
    start_date: '',
    end_date: "",
    CLAIM_STATUSES: ""
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
      setClaimList(data.data);
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

  // console.log(userList)


  return (
    <div className="relative">
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        Calim form list
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
            name="transaction_id"
            placeholder="transaction_id"
            value={filters.transaction_id}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          />
          <input
            type="text"
            name="user_email"
            placeholder="user_email"
            value={filters.user_email}
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

          <input
            type="text"
            name="start_date"
            placeholder="start_date"
            value={filters.start_date}
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
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {calimList.map((item, i) => (
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


      {openSheet.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
          <div className="bg-white w-full  rounded-lg shadow-lg p-6 relative max-w-[60vw] max-h-[80vh] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Claim Details</h2>

            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => setOpenSheet({ show: false, details: {} })}
            >
              ✖
            </button>

            <div className="space-y-2 text-sm">
              <p><strong>Transaction ID:</strong> {openSheet.details.transaction_id}</p>
              <p><strong>Reason:</strong> {openSheet.details.reason}</p>
              <p><strong>Status:</strong> {openSheet.details.status}</p>
              <p><strong>Created At:</strong> {formatDate(openSheet.details.createdAt)}</p>

              <div>
                <strong>Dynamic Fields:</strong>
                <ul className="list-disc ml-6 mt-1">
                  {openSheet.details.dynamic_fields &&
                    Object.entries(openSheet.details.dynamic_fields).map(
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      ([key, value]: [string, any]) => (
                        <li key={key}>
                          <strong>{key}:</strong>{" "}
                          {typeof value === "string" && value.startsWith("http") ? (
                            <a href={value} target="_blank" className="text-blue-600 underline">
                              {value}
                            </a>
                          ) : (
                            String(value)
                          )}
                        </li>
                      )
                    )}
                </ul>
              </div>
            </div>
             <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Claim Status Update</h2>

        <select
          className="border p-2 rounded-md text-sm w-full max-w-xs"
          value={openSheet.details.status}
          onChange={(e) =>
            setOpenSheet((prev) => ({
              ...prev,
              details: {
                ...prev.details,
                status: e.target.value,
              },
            }))
          }
        >
    
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
        </select>

        <button
          onClick={async () => {
            try {
              await axios.post(
                claim_form_edit_api, 
                {
                  claim_id: openSheet.details._id,
                  status: openSheet.details.status,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              toast.success("Status updated");
              setOpenSheet({ show: false, details: {} });
              getList(); 
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
              toast.error(err?.response?.data?.message || "Failed to update status");
            }
          }}
          className=" bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 ml-4 rounded-md"
        >
          Update Status
        </button>
      </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimFormList;
