"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import {
  list_store_dashboard_api,
  product_dashboard_list_,
} from "@/utils/api_url";
import PaginationControls from "@/app/dashboard/_components/PaginationControls";
import { ICampaign } from "@/model/CampaignModel";
import Image from "next/image";

const ProductList = () => {
  const [produt_list, setProdutList] = useState<ICampaign[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalpage, setTotalPage] = useState(1);

  const [storeList, setStoreList] = useState<{ name: string; _id: string }[]>(
    []
  );
  const token = useSelector((state: RootState) => state.user.token);
  const [showFilter, setShowFilter] = useState(false);

  // ✅ Filters state (All filters included)
  const [filters, setFilters] = useState({
    title: "",
    store: "",
    long_poster: null as boolean | null,
    main_banner: null as boolean | null,
    premium_product: null as boolean | null,
    flash_sale: null as boolean | null,
    product_status: "ACTIVE",
    startDate: "",
    endDate: "",
  });

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const updatedFilters = { ...prev, [name]: value };
      return updatedFilters;
    });
  };

  const handleBooleanFilter = (name: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value === "" ? null : value === "true",
    }));
  };

  // ✅ Fetch Products
  const get_product = async () => {
    try {
      const { data } = await axios.post(
        product_dashboard_list_,
        { ...filters, page: currentPage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTotalPage(data.pagination.totalPages);
      // console.log("data", data);
      setProdutList(data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        // console.error("Error ", error.response?.data.message);
        toast.error(error.response?.data.message || "An error occurred");
      } else {
        // console.error("Unknown error", error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    get_product();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // console.log(produt_list);

  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        Products
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
          <div>
            <span>Search</span>
            <input
              type="text"
              name="title"
              placeholder="Product Title"
              value={filters.title}
              onChange={handleFilterChange}
              className="border p-2 rounded-md h-9 text-sm outline-none "
            />
          </div>

          <div>
            <span>Store</span>
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
          </div>

          <div>
            <span>Product status</span>
            <select
              name="product_status"
              value={filters.product_status}
              onChange={handleFilterChange}
              className="border p-2 rounded-md h-9 text-sm outline-none "
            >
              <option disabled>Product status</option>
              <option value="ALL">All</option>
              <option value="ACTIVE">Active</option>
              <option value="PAUSE">Paused</option>
              <option value="DELETE">Deleted</option>
            </select>
          </div>

          <div>
            <span>Start Date</span>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="border p-2 rounded-md h-9 text-sm outline-none "
            />
          </div>

          <div>
            <span>End Date</span>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="border p-2 rounded-md h-9 text-sm outline-none "
            />
          </div>

          {/* ✅ Boolean Filters */}
          {["long_poster", "main_banner", "premium_product", "flash_sale"].map(
            (filter) => (
              <div key={filter}>
                <span>{filter}</span>
                <select
                  value={
                    filters[filter as keyof typeof filters] === null
                      ? ""
                      : String(filters[filter as keyof typeof filters])
                  }
                  onChange={(e) =>
                    handleBooleanFilter(
                      filter as keyof typeof filters,
                      e.target.value
                    )
                  }
                  className="border p-2 rounded-md h-9 text-sm outline-none "
                >
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            )
          )}
          <button
            onClick={get_product}
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
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Category
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Brand
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Banner
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Price
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {produt_list.map((product: ICampaign, i) => (
                <tr className="bg-white hover:bg-gray-100" key={i}>
                  <td className="px-6 py-4 flex items-center gap-4">
                    <Image
                      src={product.product_img}
                      alt={product.title}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-md"
                    />
                    <a className="text-gray-800 text-sm hover:text-blue-400 line-clamp-2">
                      {product.title}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {typeof product.category === "object" && "name" in product.category
                      ? (product.category as { name: string }).name
                      : String(product.category)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {typeof product.store === "object" && "name" in product.store
                      ? (product.store as { name: string }).name
                      : String(product.store)}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <span
                      className={`px-2 py-1 text-sm text-white rounded-md ${
                        product.product_status === "ACTIVE"
                          ? "bg-green-500"
                          : product.product_status === "PAUSE"
                          ? "bg-yellow-400"
                          : "bg-red-400"
                      }`}
                    >
                      {product.product_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <span
                      className={`px-2 py-1 text-sm rounded-md ${
                        product.main_banner?.[0]?.is_active
                          ? "bg-yellow-300"
                          : "bg-gray-300"
                      }`}
                    >
                      {product.main_banner?.[0]?.is_active ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {String(product.actual_price)}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/product/edit/${product.product_slug}`}
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

export default ProductList;
