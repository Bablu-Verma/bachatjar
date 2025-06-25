"use client";

import { ICampaign } from "@/model/CampaignModel";
import React, { useState } from "react";


interface campaign__event_props {
  campaign_data: ICampaign;
}

const Campaign_user_event: React.FC<campaign__event_props> = ({
  campaign_data,
}) => {
  const [opentc, setOpentc] = useState<boolean>(false);


  return (
    <>
       <button
          onClick={() => setOpentc(true) }
          type="button"
          className=" border-2 inline-flex border-gray-200  my-7 justify-center gap-2 sm:gap-3 items-center cursor-pointer px-5 py-2 rounded-full"
        >
          <i className="fa-solid fa-note-sticky text-red-500 text-xl sm:text-2xl"></i>
          <h4 className="text-secondary text-[12px] sm:text-base text-nowrap font-normal">
           Important Information
          </h4>
        </button>

      {opentc && (
        <div className="fixed top-0 left-0 w-full h-screen  flex justify-center items-center z-50 bg-[rgba(0,0,0,.3)] ">
          <div className=" md:max-w-[700px] max-h-[700px] overflow-y-auto bg-white p-5 rounded-md">
            <h3 className="text-xl font-medium mb-3 text-secondary select-none">
            Important Information
            </h3>

            <div className="dangerouslyHTML" dangerouslySetInnerHTML={{ __html: campaign_data?.t_and_c || ''}}>
            </div>
            <button
              onClick={() => setOpentc(false)}
              className="mt-2 underline hover:text-red-500"
            >
              I am read this Information
            </button>
          </div>
        </div>
      )}

     
    </>
  );
};

export default Campaign_user_event;
