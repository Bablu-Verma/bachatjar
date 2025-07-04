import Image from "next/image";
import React from "react";
import chat_icon from "../../public/ws_icon.png"



const WhatsApp = () => {
  return (
   <a target="_blank" href={`https://wa.me/91${process.env.NEXT_PUBLIC_NUMBER}`} className='fixed bottom-28 right-6 w-[42px] rounded-full shadow-sm h-[42px]  z-50 opacity-80 hover:opacity-100  cursor-pointer duration-300' title="Connect Our Team">
        <Image src={chat_icon} alt="Chatt_icon" height={42} width={42} className="rounded-full"/>
      </a>

  );
};

export default WhatsApp;
