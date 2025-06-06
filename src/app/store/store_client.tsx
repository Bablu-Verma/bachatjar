"use client";

import StoreCard from "@/components/small_card/StoreCard";
import { useEffect, useState } from "react";
import { IStore } from "@/model/StoreModel";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import axios, { AxiosError } from "axios";
import { list_store_api } from "@/utils/api_url";
import React from "react";
import SimpleLoader from "@/components/SimpleLoader";

interface SProps {
  page_data: IStore[];
}

const StoreClient: React.FC<SProps> = ({ page_data }) => {
  const [page, setPage] = useState(1);
  const [storeclient, setStoreClient] = useState<IStore[]>(page_data);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const token = useSelector((state: RootState) => state.user.token);

  const getCoupon = async (reset: boolean = false) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        list_store_api,
        { page },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newDeals = data.data || [];
      if (newDeals.length === 0) setHasMore(false);
      setStoreClient((prev) => (reset ? newDeals : [...prev, ...newDeals]));
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching deals:", error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page > 1) getCoupon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <>
      <div className="mt-4">
        {storeclient.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {storeclient.map((item, i) => {
              return <StoreCard item={item} key={i} />;
            })}
          </div>
        )}

        <div className="flex justify-center items-center pt-10 ">
          {storeclient.length >= 10 ? (
            hasMore ? (
              <button
                onClick={() => setPage(page + 1)}
                className="text-sm py-2 px-8 transition-all duration-300 ease-in-out rounded-full border-2 border-primary text-white bg-primary flex items-center gap-2"
                disabled={loading}
              >
                {loading ? <SimpleLoader /> : "More Store"}
              </button>
            ) : (
              <span className="text-gray-500 text-sm">No more store</span>
            )
          ) : null}
        </div>
      </div>
    </>
  );
};

export default StoreClient;
