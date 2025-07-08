'use client'

import Image from "next/image";
import React, { useEffect, useState } from "react";
import loginbanner from "../../public/loginbanner.png";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { getClientCookie, setClientCookie } from "@/helpers/client/client_function";


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
    

    const handle_process =  ()=>{
        setShowPopup(false);
        setClientCookie("hasVisited", "true", 60 * 24 * 10);
        router.push('/login') 
    }
    
    if (!showPopup) return null;

  return (
    <div className="z-40  fixed top-0 w-screen h-screen left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.3)]">
      <div className=" absolute w-[80%] md:w-[50%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
      <span className='absolute -top-8 -right-8 p-1 cursor-pointer bg-red-300 rounded-full' onClick={handleClose}>
        <IoClose className="text-2xl text-secondary" />
      </span>
        <button onClick={handle_process}>
          <Image
            src={loginbanner}
            alt="login banner"
            width={400}
            className="h-auto w-full  rounded-md"
          />
        </button>
      
      </div>
    </div>
  );
};

export default Loginhomepopup;
