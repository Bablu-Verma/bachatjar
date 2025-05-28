"use client";

import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";

import React, { ReactNode, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { logout } from "@/redux-store/slice/userSlice";
import { usePathname } from "next/navigation";
import Loader_ from "@/components/Loader_";
import { FaChevronDown, FaTimes } from "react-icons/fa"; // Importing icons for toggle and close
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
  const [isOpen, setIsOpen] = useState(false); // State for toggle

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

  // Function to toggle menu on mobile
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Function to handle link click to close the menu
  const handleLinkClick = () => {
    if (isOpen) {
      setIsOpen(false); // Close the menu when a link is clicked
    }
  };

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
            
              <button
                onClick={toggleMenu}
                className=" text-sm flex gap-1 justify-between items-center  text-primary md:hidden ml-10" 
              >
                <FaChevronDown
                  className={`transition-transform text-base ${isOpen ? "rotate-180" : "rotate-0"}`} 
                /> <span>Menu</span>
              </button>
            </h4>
          </div>

          <div className="my-2 lg:my-12 px-2 flex relative gap-[2%] justify-between ">
            <div
              className={`absolute  md:relative top-0 left-0 bottom-0 p-4 ${isOpen && 'min-w-[300px] ' }  ${isOpen ? 'translate-x-0' : ' -translate-x-full md:translate-x-0'  }  z-20 bg-white md:bg-transparent`} 
              
            >
              <h2 className="text-xl font-semibold mb-2 text-dark flex justify-between items-center">
                <span>
                <i className="text-base text-dark fa-solid fa-link"></i> Links
                </span>
                {/* Close Icon */}
                <button
                  onClick={toggleMenu}

                  className="text-xl md:hidden text-dark"
                >
                  <FaTimes />
                </button>
              </h2>
              <Link
                href="/profile"
                onClick={handleLinkClick} 
                className={`text-sm ${
                  pathname == "/profile-edit" ? "text-primary" : "text-gray-500"
                } hover:pl-1 cursor-pointer duration-200 my-1 py-0.5 block`}
              >
                Profile
              </Link>
              <Link
                href="/edit"
                onClick={handleLinkClick} 
                className={`text-sm ${
                  pathname == "/profile-edit" ? "text-primary" : "text-gray-500"
                } hover:pl-1 cursor-pointer duration-200 my-1 py-0.5 block`}
              >
                  Edit 
              </Link>
              {/* <Link
                href="/address"
                onClick={handleLinkClick} 
                className={`text-sm ${
                  pathname == "/address" ? "text-primary" : "text-gray-500"
                } hover:pl-1 cursor-pointer duration-200 my-1 py-0.5 block`}
              >
                Address
              </Link> */}
              <Link
                href="/order-list"
                onClick={handleLinkClick} 
                className="text-sm text-gray-500 hover:pl-1 cursor-pointer duration-200 my-1 py-0.5 block"
              >
                All Order
              </Link>
              <Link
                href="/addupi"
                onClick={handleLinkClick} 
                className="text-sm text-gray-500 hover:pl-1 cursor-pointer duration-200 my-1 py-0.5 block"
              >
               Add UPI
              </Link>
              <Link
                href="/wishlist"
                onClick={handleLinkClick} 
                className="text-sm text-gray-500 hover:pl-1 cursor-pointer duration-200 my-1 py-0.5 block"
              >
                Wishlist
              </Link>
              <Link
                href="/withdrawal/request"
                onClick={handleLinkClick} 
                className="text-sm text-gray-500 hover:pl-1 cursor-pointer duration-200 my-1 py-0.5 block"
              >
                withdrawal
              </Link>
              <Link
                href="/withdrawal-list"
                onClick={handleLinkClick} 
                className="text-sm text-gray-500 hover:pl-1 cursor-pointer duration-200 my-1 py-0.5 block"
              >
                withdrawal list
              </Link>
              {(user_data.role === "admin" ||
                user_data.role === "data_editor" ||
                user_data.role === "blog_editor") && (
                <Link
                  href="/dashboard"
                  onClick={handleLinkClick} 
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
            <div className="w-full md:w-[80%] shadow rounded md:bg-gray-200 p-6 md:p-8">
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
