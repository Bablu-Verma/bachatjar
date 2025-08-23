"use client";

import { useEffect, useState } from "react";
import { IStore } from "@/model/StoreModel";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import axios from "axios";
import { list_store_api } from "@/utils/api_url";
import React from "react";
import SimpleLoader from "@/components/SimpleLoader";
import Image from "next/image";


interface SProps {
  setStoreId: (id: string) => void;  // ya jo bhi type hai id ka
}

const Campaign_Store: React.FC<SProps> = ({setStoreId}) => {
  
  const [page, setPage] = useState(1);
  const [storeclient, setStoreClient] = useState<IStore[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const token = useSelector((state: RootState) => state.user.token);

 const getStore = async () => {
  setLoading(true);
  try {
    const { data } = await axios.post(
      list_store_api,
      {  }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const newDeals = data?.data || [];

    // console.log(newDeals)

    if (newDeals.length === 0) {
      setHasMore(false);
    } else {
      // 👇 prev state se merge karna better hai
      setStoreClient((prev) => [...prev, ...newDeals]);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching deals:", error.response?.data?.message || error.message);
    } else {
      console.error("Unknown error:", error);
    }
    setHasMore(false);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    getStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <>
      <div className=" p-3 rounded-xl border border-gray-300 bg-white px-4">
        <h3 className="text-gray-900 text-lg">Store</h3>
        {storeclient &&  storeclient.length > 0 && (
          <div className="grid grid-cols-2  gap-3">
            {storeclient.map((item, i) => {
              return <button onClick={()=>setStoreId(item._id as string)} key={i}>
                <Image src={item.store_img} alt={item.name} width={200} height={100} className=" w-full " />
              </button>
            })}
          </div>
        )}

        <div className="flex justify-center items-center  ">
          {storeclient && storeclient.length >= 10 ? (
            hasMore ? (
              <button
                onClick={() => setPage(page + 1)}
                type="button"
                className="text-sm py-2 px-8 transition-all duration-300 ease-in-out rounded-full border-2 border-primary mt-10 text-white bg-primary flex items-center gap-2"
                disabled={loading}
              >
                {loading ? <SimpleLoader /> : "More Store"}
              </button>
            ) : (
              <span className="text-gray-500 mt-10 text-sm">No more store</span>
            )
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Campaign_Store;
