"use client";

import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";

import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { logout } from "@/redux-store/slice/userSlice";
import { usePathname } from "next/navigation";
import Loader_ from "@/components/Loader_";
import { clearSummary } from "@/redux-store/slice/cashbackSummary";

interface LayoutProps {
  children: ReactNode;
}

export interface User {
  name: string;
  email: string;
  role: string;
}

const ProfileLayout: React.FC<LayoutProps> = ({ children }) => {
  const user_data = useSelector(
    (state: RootState) => state.user.user
  ) as User | null;

  const dispatch = useDispatch();
  const pathname = usePathname();

  const logOut_user = () => {
    setTimeout(() => {
      dispatch(logout());
      dispatch(clearSummary());
      window.location.href = "/login";
    }, 1000);
  };

  if (!user_data) {
    return <Loader_ />;
  }



  return (
    <>
    
      <MainHeader />
      <main className="max-w-6xl relative mx-auto pt-8 lg:pt-14 pb-16">
        <section>
          <div className="flex justify-between mb-6 lg:mb-16">
            <h4 className="flex gap-1 text-base lg:text-lg pl-2">
              Welcome!{" "}
              <span className="text-primary capitalize">
                {user_data?.name || "Guest"}
              </span>
            
            
            </h4>
          </div>

          <div className="my-2 lg:my-12 px-2 flex relative gap-[2%] justify-between ">
            <div
              className={`hidden lg:block lg:w-[20%] relative  p-4 bg-white `} 
              
            >
              <h2 className="text-xl font-semibold mb-2 text-dark flex justify-between items-center">
                <span>
                <i className="text-base text-dark fa-solid fa-link"></i> Links
                </span>
              
              </h2>
              <Link
                href="/profile"
              
                className={`text-sm ${
                  pathname == "/profile-edit" ? "text-primary" : "text-gray-500"
                } hover:pl-1 cursor-pointer duration-200 my-1 py-0.5 block`}
              >
                Profile
              </Link>
              <Link
                href="/edit"
              
                className={`text-sm ${
                  pathname == "/profile-edit" ? "text-primary" : "text-gray-500"
                } hover:pl-1 cursor-pointer duration-200 my-1 py-0.5 block`}
              >
                  Edit 
              </Link>
           
              <Link
                href="/order-list"
             
                className="text-sm text-gray-500 hover:pl-1 cursor-pointer duration-200 my-1 py-0.5 block"
              >
                All Order
              </Link>
              <Link
                href="/addupi"
             
                className="text-sm text-gray-500 hover:pl-1 cursor-pointer duration-200 my-1 py-0.5 block"
              >
               Add UPI
              </Link>
              <Link
                href="/wishlist"
              
                className="text-sm text-gray-500 hover:pl-1 cursor-pointer duration-200 my-1 py-0.5 block"
              >
                Wishlist
              </Link>
               <Link
                href="/notification"
             
                className="text-sm text-gray-500 hover:pl-1 cursor-pointer duration-200 my-1 py-0.5 block"
              >
                Notification
              </Link>
              <Link
                href="/withdrawal/request"
            
                className="text-sm text-gray-500 hover:pl-1 cursor-pointer duration-200 my-1 py-0.5 block"
              >
                Withdrawal
              </Link>
              
              <Link
                href="/withdrawal-list"
               
                className="text-sm text-gray-500 hover:pl-1 cursor-pointer duration-200 my-1 py-0.5 block"
              >
                Withdrawal list
              </Link>
              {(user_data.role === "admin" ||
                user_data.role === "data_editor" ||
                user_data.role === "blog_editor") && (
                <Link
                  href="/dashboard"
                 
                  className="text-sm text-gray-500 hover:pl-1 cursor-pointer duration-200 my-1 py-0.5 block"
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={logOut_user}
                className="text-sm text-red-600  font-medium hover:pl-1 cursor-pointer duration-200 my-1 mt-5 py-1 block"
              >
                <i className="fa-solid fa-right-from-bracket"></i> Logout
              </button>
            </div>
            <div className="w-full lg:w-[80%] shadow rounded md:bg-gray-200 p-6 md:p-8">
              {children}
            </div>
          </div>
        </section>
      </main>
      <BottomToTop />
      <Footer />
    </>
  );
};

export default ProfileLayout;
