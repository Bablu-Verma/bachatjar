"use client";

import { newsletter_save_email_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { BsSend } from "react-icons/bs";


const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const sendClaimForm = async () => {


    if (!email) {
      toast.error("Please enter an email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true)
    try {
      await axios.post(
        newsletter_save_email_api,
        {
          email: email
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }
      );

      toast.success("Email submit successfully!");
      setEmail('')

    } catch (error) {

      if (error instanceof AxiosError) {
        console.error("Error ", error.response?.data.message);
        toast.error(error.response?.data.message || "Submission failed");
      } else {
        console.error("Unknown error", error);
        toast.error("An error occurred while submitting the Email");
      }
    } finally {
      setLoading(false)
    }
  };



  return (
    <div className="bg-gray-800 py-10 text-white">
      <div className="max-w-6xl mx-auto px-4">
       <div className="flex justify-center md:justify-between flex-col md:flex-row items-center md:items-end pb-5">
        <div>
         <h4 className="text-[12px] sm:text-base uppercase text-center md:text-left tracking-wide  font-normal pb-3 ">Get Latest Offers</h4>
        <h1 className="text-2xl md:text-3xl pb-3  tracking-wide text-center md:text-left font-semibold md:pb-1">Subscribe Now</h1>
       </div>
       
        <div className="flex items-center justify-center relative rounded-full ">
          <div className='relative'>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              className="pl-5 pr-3 outline-none    rounded-full py-2 text-black w-72 sm:w-80"

            />
            <button
              type="button"
              disabled={loading}
              onClick={sendClaimForm}
              className="p-3 opacity-70 hover:opacity-95 absolute z-10 right-2 top-0 font-semibold"
            >
              <BsSend className="text-xl text-primary" />
            </button>
          </div>
        </div>
       </div>
         <p className="text-sm md:text-base text-center md:text-left   font-light tracking-wide">Subscribe to get exclusive deals, updates & insider-only  discounts—direct to your inbox.</p>
      </div>
    </div>
  );
};

export default Newsletter;
