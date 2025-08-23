"use client";


import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import axios from "axios";
import { category_list_api } from "@/utils/api_url";
import React from "react";

import Image from "next/image";
import { ICategory } from "@/model/CategoryModel";


interface SProps {
  setcategoryId: (id: string) => void;  // ya jo bhi type hai id ka
}

const Campaign_Category: React.FC<SProps> = ({setcategoryId}) => {
  
  
  const [storeclient, setStoreClient] = useState<ICategory[]>([]);


  const token = useSelector((state: RootState) => state.user.token);

 const getCategory = async () => {

  try {
    const { data } = await axios.post(
      category_list_api,
      {  }, // 👈 pagination
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const newDeals = data?.data || [];


   setStoreClient((prev) => [...prev, ...newDeals]);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching deals:", error.response?.data?.message || error.message);
    } else {
      console.error("Unknown error:", error);
    }
   
  } finally {
    
  }
};

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <>
      <div className=" p-3 mt-3 rounded-xl border border-gray-300 bg-white px-4">
        <h3 className="text-gray-900 text-lg">Category</h3>
        {storeclient &&  storeclient.length > 0 && (
          <div className="grid grid-cols-2  gap-3">
            {storeclient.map((item, i) => {
              return <button  type="button" onClick={()=>setcategoryId(item._id.toString())} key={i}>
                <Image src={item.imges[0] } alt={item.name} width={150} height={80} className=" w-full " />
                <h5 className="text-sm">{item.name}</h5>
              </button>
            })}
          </div>
        )}

       
      </div>
    </>
  );
};

export default Campaign_Category;
