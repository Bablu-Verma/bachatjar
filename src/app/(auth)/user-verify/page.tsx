"use client";

import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";

import { resend_otp_api, user_verify_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import OtpInput from "react-otp-input";
import verifyotp_image from '../../../../public/enter_otp.svg'


interface UserRegisterInfo {
  email: string;
  name: string;
  token: string;
}

const UserVerify = () => {
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [userData, setUserData] = useState<UserRegisterInfo | undefined>(
    undefined
  );

  const route = useRouter();

  useEffect(() => {
    const data = sessionStorage.getItem("UserRegisterInfo");
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, []);

  const handleResendOtp = async () => {
    try {
      const { data } = await axios.post(
        resend_otp_api,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      );

      const UserRegisterInfo = {
        token: data.token,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
      };

      sessionStorage.setItem(
        "UserRegisterInfo",
        JSON.stringify(UserRegisterInfo)
      );

      setResendTimer(30);
      toast.success("OTP has been resent successfully!");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error registering user", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
        toast.error("Failed to resend OTP. Please try again.");
      }
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  const SubmitData = async () => {
    if (otp.length !== 4) {
      toast.error("Please enter a valid 4-digit OTP");
      return;
    }

    try {
      
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data } = await axios.post(
        user_verify_api,
        {
          otp: otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      );

      // console.log(data);
      toast.success("Your Email Verified!");
      setTimeout(()=>{
        route.push('/login')
      },1000)
      route.push('/login')
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error verify user", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
        toast.error("Failed to verify");
      }
    }
  };

  React.useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => Math.max(prev - 1, 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  return (
    <>
     
      <MainHeader />
      <main>
        <div className="max-w-6xl mx-auto min-h-screen flex justify-center items-center pb-10 md:pb-3">
         
        
          <div className=" lg:flex justify-center gap-10 items-center">
          <Image src={verifyotp_image} alt="login"  width={350} height={350} className=""/>
            <div className="max-lg:text-center">  
              <h2 className="text-2xl lg:text-3xl font-semibold mb-2 mt-4">Verify Account</h2>
              <p className="text-sm font-normal mb-10 mt-2 text-gray-600">
                <i className="fa-regular fa-envelope text-lg text-gray-600"></i>{" "}
                Check your Email Inbox, verify your account <br />
                <span className="text-secondary font-medium">
                  {userData && userData.email}
                </span>
              </p>

              <div className="flex flex-col gap-4 max-lg:items-center">
                <OtpInput
                  value={otp}
                  onChange={handleOtpChange}
                  numInputs={4}
                  shouldAutoFocus={true}
                  containerStyle={"verify_input_container"}
                  inputStyle={"verify_input"}
                  renderSeparator={<span>-</span>}
                  renderInput={(props) => <input {...props} />}
                />
              </div>
              <div className="mt-6">
                <span className="text-sm font-normal w-10 inline-block">
                  {resendTimer}s
                </span>
                <button
                  className="text-sm underline ml-2"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0}
                  style={{
                    opacity: resendTimer > 0 ? 0.5 : 1,
                    cursor: resendTimer > 0 ? "not-allowed" : "pointer",
                  }}
                >
                  Resend OTP
                </button>
              </div>
              <div className="my-10">
                <button
                  onClick={SubmitData}
                  className="bg-primary text-white text-sm lg:text-base font-medium duration-800 p-1.5 min-w-36 w-full lg:min-w-48 border-[1px] border-primary rounded shadow-sm hover:shadow-2xl"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
};

export default UserVerify;
