"use client";

import React, { useState } from "react";

interface IStoreDesc {
  html_: string;
}

export const StoreDesc: React.FC<IStoreDesc> = ({ html_ }) => {
    const [open, setOpen] = useState(false)
  return (
  <div className='relative'>
   <div className={`${open ? 'h-auto':'h-24'} relative overflow-hidden pt-2`}>
     <div
      className="dangerouslyHTML store_desc"
      dangerouslySetInnerHTML={{ __html: html_ }}
    />
   </div>
   <button className="text-[12px] text-dark bg-white px-3 py-[2px]  rounded-full text-center mt-2  font-medium  inline-block  " onClick={()=>setOpen(!open)} type="button">{open?'Show Less ▲':"Show More ▼"}</button>
  </div>
  );
};

interface IStoreTC {
  store_tc: string;
}

export const Store_tc: React.FC<IStoreTC> = ({
  store_tc
}) => {
  const [opentc, setOpentc] = useState<boolean>(false);


  return (
    <>
       <button
          onClick={() => setOpentc(true) }
          type="button"
          className="items-center cursor-pointer px-5 py-2 absolute right-2 bottom-2 "
        >
          
          <h4 className="text-white tracking-wider  text-sm text-nowrap font-normal underline hover:text-secondary">
           Important Information
          </h4>
        </button>

      {opentc && (
        <div className="fixed top-0 left-0 w-full h-screen  flex justify-center items-center z-50 bg-[rgba(0,0,0,.3)] ">
          <div className=" md:max-w-[700px] max-h-[700px] overflow-y-auto bg-white p-5 rounded-md">
            <h3 className="text-xl font-medium mb-3 text-secondary select-none">
            Store Terms & Condition
            </h3>

            <div className="dangerouslyHTML" dangerouslySetInnerHTML={{ __html: store_tc || ''}}>
            </div>
            <button
              onClick={() => setOpentc(false)}
              className="mt-2 underline hover:text-red-500"
            >
            Close
            </button>
          </div>
        </div>
      )}

     
    </>
  );
};
