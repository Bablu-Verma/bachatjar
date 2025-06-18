"use client";

import React from "react";

import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import Link from "next/link";
import Image from "next/image";

import logo from "../../public/light_logo.png";

const Footer = () => {
  const user_data = useSelector((state: RootState) => state.user.token);

  const userlogin = user_data ? true : false;

  return (
    <footer className="bg-black text-white">
      <div className="max-w-6xl mx-auto px-2 relative grid pt-16 pb-8 gap-7 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="mb-4 inline-block">
            <Image
              src={logo}
              className="w-[140px] lg:w-[160px] h-auto"
              alt="logo"
            />
           
          </Link>
          <p className="text-base font-thin mb-3">
            Get Up to 100% off on your All Orders
          </p>
        </div>

        <div>
          <h3 className="text-lg font-normal mb-4">Redirect </h3>
          <div className="flex flex-col gap-1">
            <Link
              href="/"
              className="text-sm font-thin hover:pl-1 duration-200 py-0.5"
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="text-sm font-thin hover:pl-1 duration-200 py-0.5"
            >
              Blog
            </Link>
            <Link
              href="/store"
              className="text-sm font-thin hover:pl-1 duration-200 py-0.5"
            >
              Store
            </Link>

            <Link
              href="/coupons"
              className="text-sm font-thin hover:pl-1 duration-200 py-0.5"
            >
              Coupons
            </Link>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-normal mb-4">Account</h3>
          <div className="flex flex-col gap-1">
            <Link
              href={userlogin ? "/profile-edit" : "/login"}
              className="text-sm font-thin hover:pl-1 duration-200 py-0.5"
            >
              {userlogin ? "Profile" : "Login / Register"}
            </Link>

            <Link
              href={userlogin ? "/wishlist" : "/login"}
              className="text-sm font-thin hover:pl-1 duration-200 py-0.5"
            >
              Wishlist
            </Link>
            <Link
              href={userlogin ? "/order-list" : "/login"}
              className="text-sm font-thin hover:pl-1 duration-200 py-0.5"
            >
              All Order
            </Link>
            <Link
              href={userlogin ? "/addupi" : "/login"}
              className="text-sm font-thin hover:pl-1 duration-200 py-0.5"
            >
              Add UPI
            </Link>
            <Link
              href={userlogin ? "/widthdraw" : "/login"}
              className="text-sm font-thin hover:pl-1 duration-200 py-0.5"
            >
              Withdraw Cashback
            </Link>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-normal mb-4">Quick Link</h3>
          <div className="flex flex-col gap-1">
            <Link
              href="/contact-us"
              className="text-sm font-thin hover:pl-1 duration-200 py-0.5"
            >
              Contact Us
            </Link>

            <Link
              href="/about"
              className="text-sm font-thin hover:pl-1 duration-200 py-0.5"
            >
              About Us
            </Link>
            <Link
              href="/faq"
              className="text-sm font-thin hover:pl-1 duration-200 py-0.5"
            >
              FAQ
            </Link>
             <a
             target="_blank"
              href="https://forms.gle/emfxCorGPxDcmTgo6"
              className="text-sm font-thin hover:pl-1 duration-200 py-0.5"
            >
              Feedback & Suggestions
            </a>
            <Link
              href="/terms_conditions"
              className="text-sm font-thin hover:pl-1 duration-200 py-0.5"
            >
              Terms Conditions
            </Link>
            <Link
              href="/privacy_policy"
              className="text-sm font-thin hover:pl-1 duration-200 py-0.5"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
        

        <div>
          <h3 className="text-lg font-normal mb-4">Support</h3>
          <address className="text-sm font-thin mb-3">
            Noida sector 121, <br />
            India-201307
          </address>
          <i className="text-sm font-thin mb-2 inline-block">
            help@bachatjar.com
          </i>
          <p className="text-sm font-thin">+91 {process.env.NEXT_PUBLIC_NUMBER}</p>
        </div>
      </div>
      <div className="max-w-6xl m-auto flex justify-center items-center gap-4 py-5">
        <a target="_blank" className="text-sm tracking-wider opacity-75 hover:opacity-100 select-none" href="https://www.linkedin.com/company/bachat-jar/">Linkdin</a>
        <a target="_blank" className="text-sm tracking-wider opacity-75 hover:opacity-100 select-none" href="https://www.instagram.com/bachat_jar/">Instagram</a>
        {/* <a target="_blank" className="text-sm tracking-wider opacity-75 hover:opacity-100 select-none"  href="https://www.linkedin.com/company/bachat-jar/">Facebook</a>
        <a target="_blank" className="text-sm tracking-wider opacity-75 hover:opacity-100 select-none" href="https://www.linkedin.com/company/bachat-jar/">YouTube</a>
        <a target="_blank" className="text-sm tracking-wider opacity-75 hover:opacity-100 select-none" href="https://www.linkedin.com/company/bachat-jar/">Telegram</a> */}
      </div>
      <div className="py-3 border-t-[0.5px] border-gray-400 select-none">
        <div className="py-10 flex justify-center items-center flex-col">
          <h1 className="text-2xl md:text-3xl lg:text-4xl pb-1 text-white ">
            #SaveMoreWithBachatJar
          </h1>
          <h5>We help save your money</h5>
        </div>
        <p className="text-sm tracking-wide font-medium text-gray-600 text-center">
          <i className="fa-regular  fa-copyright"></i> Copyright BachatJar 2025.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
