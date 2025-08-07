'use client'


import React, { useEffect, useState } from "react";

import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { getClientCookie, setClientCookie } from "@/helpers/client/client_function";

import { FaMoneyBillWave } from "react-icons/fa";



const Loginhomepopup = () => {

  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter()
  const token = useSelector((state: RootState) => state.user.token);

  

  useEffect(() => {
    const hasVisited = getClientCookie("hasVisited")

    if (!hasVisited && !token) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 80000);

      return () => clearTimeout(timer);
    }
  }, [token]);

  const handleClose = () => {
    setShowPopup(false);
    setClientCookie("hasVisited", "true", 60 * 24 * 2);
  };


  const handle_process = () => {
    setShowPopup(false);
    setClientCookie("hasVisited", "true", 60 * 24 * 10);
    router.push('/login')
  }

  if (!showPopup) return null;

  return (
       <div className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.3)] flex items-end justify-center">
      <div className="w-full bg-white animate-slideUp">
        <div className="m-auto max-w-6xl relative p-4">
          <span
            className="absolute -top-10 left-4 p-2 cursor-pointer bg-red-500 rounded-full text-white"
            onClick={handleClose}
          >
            <IoClose className="text-xl" />
          </span>

          <div className="text-center">
           <div className="flex justify-center gap-2 pb-3 items-center">
            <FaMoneyBillWave className="text-3xl text-green-500" />
            <h3 className="text-xl font-bold text-gray-800">
             Don&apos;t Miss Out on Cashback!
            </h3>
           </div>
            <p className="text-gray-600 mb-4">
              Log in to track your earnings and claim your cashback. Your savings are waiting!
            </p>
            <button
              className="inline-block text-sm font-medium px-5 py-2 bg-primary border-2 border-primary text-white hover:text-primary  rounded-full shadow-md hover:bg-white transition-colors"
              onClick={handle_process}
            >
              Start Earning Now
            </button>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Loginhomepopup;
