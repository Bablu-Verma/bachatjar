"use client";

import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";

import axios, { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import forgatepassword_image from "../../../../public/forgatepassword.svg";
import { change_password_request_api } from "@/utils/api_url";

interface IUserData {
  email: string;
}

const ForgotPassword = () => {
  const [userData, setUserData] = useState<IUserData>({
    email: "",
  });

  const SubmitData = (): void => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!userData.email) {
      toast.error("Email is required");
      return;
    }

    if (!emailRegex.test(userData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    call_db();
  };

  const call_db = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data } = await axios.post(
       change_password_request_api,
        {
          email: userData.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Chack Your Register Email!");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error login user", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  const textChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (name === "email") {
      setUserData({
        ...userData,
        [name]: value,
      });
    }
  };

  return (
    <>
      <MainHeader />
      <main>
        <div className="max-w-[1400px] m-auto min-h-screen flex justify-center items-center  pb-10 md:pb-3">
          <div className="md:flex justify-center items-center gap-6">
            <Image
              src={forgatepassword_image}
              alt="login"
              width={350}
              height={350}
              className=""
            />
            <div className="w-full max-w-[400px] px-2">
              <h2 className="text-2xl lg:text-3xl font-semibold mb-2 mt-4">
                Forgot your Password
              </h2>
              <p className="text-sm font-normal mb-10">
                Don&apos;t worry your accout is safe
              </p>

              <div className="flex flex-col gap-4">
                <input
                  type="email"
                  id="email"
                  value={userData.email}
                  name="email"
                  onChange={textChange}
                  placeholder="Your register email"
                  className="w-full bg-gray-100 px-3 py-2 outline-none text-base text-black border-b-2 border-gray-500"
                />
              </div>
              <div className=" mt-6 mb-8">
                <button
                  onClick={SubmitData}
                  className="bg-primary text-white text-sm lg:text-base font-medium duration-200 p-1.5 min-w-[150px] border-[1px] border-primary rounded shadow-sm hover:shadow-2xl"
                >
                  Submit
                </button>
              </div>
              <p className="text-sm font-thin text-center">
                Back you?
                <Link
                  href="/login"
                  className="text-blue-400 ml-3 font-normal hover:underline"
                >
                  login
                </Link>
              </p>
            </div>
          </div>
        </div>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
};

export default ForgotPassword;
