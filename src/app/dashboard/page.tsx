"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { dashboard_api } from "@/utils/api_url";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";



const Dashboard_ = () => {
const token = useSelector((state: RootState) => state.user.token);
  const [dash_data, setDashData] = useState({});

  const get_data = async () => {
    try {
      const { data } = await axios.post(dashboard_api,{}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    // console.log(data.data)
    setDashData(data.data)
     
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
    get_data();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


function isPlainObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        Dashboard
      </h1>
      <div className="grid grid-cols-4 gap-6 py-5">
       
         {Object.entries(dash_data).map(([key, value]) => (
        <div key={key} className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold capitalize mb-2">{key.replace(/_/g, ' ')}</h2>
          <ul className="text-sm text-gray-700 space-y-1">
          {isPlainObject(value) &&
  Object.entries(value).map(([k, v]) => (
    <li key={k}>
      <span className="capitalize">{k.replace(/_/g, ' ')}:</span>{" "}
      <span className="font-medium">{String(v)}</span>
    </li>
))}
          </ul>
        </div>
      ))}
        
      </div>
      

    </>
  );
};

export default Dashboard_;
