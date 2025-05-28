"use client";

import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";

import { login } from "@/redux-store/slice/userSlice";
import { login_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import Image from "next/image";
import login_image from "../../../../public/login_image.svg";
import { setSummary } from "@/redux-store/slice/cashbackSummary";

interface IUserData {
  email: string;
  password: string;
}

const Login = () => {
  const [userData, setUserData] = useState<IUserData>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const dispatch = useDispatch();

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

    if (!userData.password) {
      toast.error("Password is required");
      return;
    }

    if (userData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    call_db();
  };

  const call_db = async () => {
    try {
      const { data } = await axios.post(
        login_api,
        {
          email: userData.email,
          password: userData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setUserData({
        email: "",
        password: "",
      });

      toast.success("Login success!");

      console.log(data);

      dispatch(login({ user: data.user, token: data.token }));
      dispatch(setSummary({ summary: data.summary }));

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
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
    if (name === "email" || name === "password") {
      setUserData({
        ...userData,
        [name]: value,
      });
    }
  };

  const passwordToggle = (): void => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <MainHeader />
      <main>
        <div className="max-w-6xl m-auto min-h-[80vh] flex justify-center items-center  pb-10 md:pb-3">
          <div className="col-span-1 items-center md:grid grid-cols-2">
            <Image
              src={login_image}
              alt="login"
              width={350}
              height={350}
              className=""
            />
            <div className="col-span-1 px-2 ">
              <h2 className="text-2xl lg:text-3xl font-semibold mb-2 mt-4">
                Login your account
              </h2>
              <p className="text-sm font-normal mb-6">
                Shop Your Favorite Products With Maximum Discount
              </p>

              <div className="flex flex-col gap-4">
                <input
                  type="email"
                  id="email"
                  value={userData.email}
                  name="email"
                  onChange={textChange}
                  placeholder="Your email"
                  className="w-full bg-gray-100 px-3 py-2 outline-none text-base text-black border-b-2 border-gray-500"
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="Password"
                    value={userData.password}
                    name="password"
                    onChange={textChange}
                    placeholder="Secure Password"
                    className="w-full bg-gray-100 px-3 py-2 outline-none text-base text-black border-b-2 border-gray-500"
                  />

                  <span
                    onClick={passwordToggle}
                    className="absolute top-3 right-3 cursor-pointer opacity-75 hover:opacity-95"
                  >
                    {showPassword ? (
                      <i className="fa-regular fa-eye text-dark text-xl"></i>
                    ) : (
                      <i className="fa-regular fa-eye-slash text-dark text-xl"></i>
                    )}
                  </span>
                </div>
              </div>
              <div className="flex justify-between gap-3 lg:gap-4 my-10">
                <button
                  onClick={SubmitData}
                  className="bg-primary text-white text-sm lg:text-base font-medium duration-200 p-1.5 min-w-36 lg:min-w-48 border-[1px] border-primary rounded shadow-sm hover:shadow-2xl"
                >
                  Submit
                </button>
                <Link
                  href="/forgot_password"
                  className=" text-gray-800 text-sm  font-normal duration-200 p-2 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <p className="text-sm font-thin text-center">
                I don&apos;t have an account?
                <Link
                  href="/signup"
                  className="text-blue-400 font-normal hover:underline"
                >
                  {" "}
                  SignUp{" "}
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

export default Login;
