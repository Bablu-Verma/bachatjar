"use client";

import axios, { AxiosError } from "axios";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface IUserData {
  re_enter_password: string;
  password: string;
}
const ChangePassword = () => {
  const [userData, setUserData] = useState<IUserData>({
    re_enter_password: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const SubmitData = (): void => {
    if (!userData.password) {
      toast.error("Password is required");
      return;
    }

    if (userData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (!/[A-Z]/.test(userData.password)) {
      toast.error("Password must contain at least one uppercase letter");
      return;
    }

    if (!/[0-9]/.test(userData.password)) {
      toast.error("Password must contain at least one number");
      return;
    }

    if (!/[!@#$%^&*]/.test(userData.password)) {
      toast.error(
        "Password must contain at least one special character (!@#$%^&*)"
      );
      return;
    }
    if (userData.password !== userData.re_enter_password) {
        toast.error(
          "Your Passwoed and re-enter password not match"
        );
        return;
      }

    call_db();
  };

  const call_db = async () => {
    try {
      const { data } = await axios.post(
        "",
        {
          password: userData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setUserData({
        re_enter_password: "",
        password: "",
      });

      console.log("user login successfully:", data);
      toast.success("Login success!");
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
    if (name === "re_enter_password" || name === "password") {
      setUserData({
        ...userData,
        [name]: value,
      });
    }
  };

  const passwordToggle = (): void => {
    setShowPassword(!showPassword);
  };

  const name_ = 'Rohan'

  return (
    <div className="max-w-[1400px] m-auto min-h-screen pt-20">
      <div className="w-full max-w-[370px] m-auto border-[1px] border-gray-300 rounded-md p-6">
        <h2 className="text-2xl lg:text-3xl font-semibold mb-2 mt-4">Reset your password</h2>
        <p className="text-sm font-normal mb-10">
        👋 Hi {name_}, Your account is safe
        </p>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="Password"
              value={userData.password}
              name="password"
              onChange={textChange}
              placeholder="Password"
              className="w-full bg-gray-100 pr-3 pl-1 py-2 outline-none text-base text-black border-b-2 border-gray-300"
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="re_enter_password"
              value={userData.re_enter_password}
              name="re_enter_password"
              onChange={textChange}
              placeholder="Re-enter Password"
              className="w-full bg-gray-100 pr-3 pl-1 py-2 outline-none text-base text-black border-b-2 border-gray-300"
            />
            <span
              onClick={passwordToggle}
              className="absolute top-3 right-3 cursor-pointer opacity-75 hover:opacity-95"
            >
              {showPassword ? (
                <i className="fa-regular fa-eye text-dark text-lg"></i>
              ) : (
                <i className="fa-regular fa-eye-slash text-dark text-lg"></i>
              )}
            </span>
          </div>
        </div>
        <div className="flex justify-between mt-10 mb-8">
          <button
            onClick={SubmitData}
            className="bg-primary text-white text-sm lg:text-base font-medium duration-200 p-1.5 min-w-[150px] border-[1px] border-primary rounded shadow-sm hover:shadow-2xl"
          >
            Submit
          </button>

        </div>
       <div className="flex justify-between items-center">
       <p className="text-sm font-thin">
          Go to{" "}
          <Link href="/" className="text-blue-400 font-normal hover:underline">
            Home?
          </Link>
        </p>
        <button onClick={()=>{
             setUserData({
                re_enter_password: "",
                password: "",
              });
        }} className="text-sm font-normal text-red-400 hover:underline">
         Clear Fields
        </button>
       </div>
      </div>
    </div>
  );
};

export default ChangePassword;
