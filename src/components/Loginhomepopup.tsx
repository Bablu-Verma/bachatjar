'use client'

import Image from "next/image";
import React, { useEffect, useState } from "react";
import loginbanner from "../../public/loginbanner.png";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";



const Loginhomepopup = () => {

    const [showPopup, setShowPopup] = useState(false);
    const router = useRouter()

    useEffect(() => {
      const hasVisited = localStorage.getItem("hasVisited");
  
      if (!hasVisited) {
        const timer = setTimeout(() => {
          setShowPopup(true);
        }, 30000); 
  
        return () => clearTimeout(timer); 
      }
    }, []);
  
    const handleClose = () => {
      setShowPopup(false);
      localStorage.setItem("hasVisited", "true"); 
    };
    

    const handle_process =  ()=>{
        setShowPopup(false);
        localStorage.setItem("hasVisited", "true");
        router.push('/login') 
    }
    
    if (!showPopup) return null;

  return (
    <div className="z-40  fixed top-0 w-screen h-screen left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.3)]">
      <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <span className='absolute -top-8 -right-8 p-1 cursor-pointer bg-red-300 rounded-full' onClick={handleClose}>
        <IoClose className="text-2xl text-secondary" />
      </span>
        <button onClick={handle_process}>
          <Image
            src={loginbanner}
            alt="login banner"
            width={400}
            className="h-auto rounded-md"
          />
        </button>
      </div>
    </div>
  );
};

export default Loginhomepopup;
