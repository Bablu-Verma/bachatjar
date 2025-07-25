"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import Image from "next/image";
import { IUser } from "@/common_type";
import logo from "../../../public/dark_logo.png";
import { GiTwoCoins } from "react-icons/gi";
import SearchAnimation from "../SearchAnimation";
import { logout } from "@/redux-store/slice/userSlice";
import { clearSummary } from "@/redux-store/slice/cashbackSummary";
import { FaLink, FaUser } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { BsBank2 } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { FaMoneyBillWave } from "react-icons/fa";
import { FaList } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { MdStore } from "react-icons/md";
import { RiCoupon3Fill } from "react-icons/ri";
import { FcAbout } from "react-icons/fc";
import { FaBlog } from "react-icons/fa";

import { MdHelp } from "react-icons/md";
import { FcBusinessContact } from "react-icons/fc";


const MainHeader = () => {
  const [toggleMenu, setToggleMenu] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const token_ = useSelector((state: RootState) => state.user.token);
  const pathname = usePathname();
  const user = useSelector(
    (state: RootState) => state.user.user
  ) as IUser | null;
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const notification = useSelector((state: RootState) => state.notification.items);
  const summary = useSelector((state: RootState) => state.cashbackSummary.summary)

  const unreadCount = notification.filter((n) => n.read === 'FALSE').length;

  const dispatch = useDispatch();

  const userlogin = token_ ? true : false;

  const showtoggle = () => {
    setToggleMenu(!toggleMenu);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {

        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const logOut_user = () => {
    setTimeout(() => {
      dispatch(logout());
      dispatch(clearSummary());
      window.location.href = "/login";
    }, 1000);
  };

  return (
    <nav
      className={`border-b-2 border-gray-200 z-50 bg-white sticky top-0 transition-transform duration-500 ${isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
    >
      <div className="max-w-6xl m-auto py-2 sm:py-1 flex justify-between items-center max-lg:px-4">
        <Link href="/" className="py-.5 inline-block">
          <Image
            src={logo}
            className="w-[90px] sm:w-[110px] lg:w-[130px] h-auto"
            alt="logo"
          />
          {/* <h1 className="text-secondary py-2 text-3xl font-semibold tracking-wider">Bachat<span className="text-primary">Jar</span></h1> */}
        </Link>
        <ul className="hidden lg:flex justify-center select-none">
          <li className="mx-1">
            <Link
              className={`${pathname == "/" ? "text-primary" : "text-gray-700"
                } font-medium duration-200 px-2 hover:text-gray-900`}
              href="/"
            >
              Home
            </Link>
          </li>

          <li className="mx-1">
            <Link
              className={`${pathname == "/store" ? "text-primary" : "text-gray-700"
                } font-medium duration-200 px-2 hover:text-gray-900`}
              href="/store"
            >
              Store
            </Link>
          </li>

          <li className="mx-1">
            <Link
              href="/coupons"
              className={`${pathname == "/coupons" ? "text-primary" : "text-gray-700"
                } font-medium duration-200 px-2 hover:text-gray-900`}
            >
              Coupons
            </Link>
          </li>
          <li className="mx-1">
            <Link
              href="/referral-link"
              className={`${pathname == "/referral-link" ? "text-primary" : "text-gray-700"
                } font-medium duration-200 px-2 hover:text-gray-900`}
            >
              Referral
            </Link>
          </li>
        </ul>

        <div className="flex justify-center items-center">
          {pathname != "/search" && (
            <Link
              href="/search"
              className=" relative mr-7 hidden lg:block md:min-w-[350px] min-w-[200px] w-[25%] rounded-sm overflow-hidden cursor-pointer"
            >
              <SearchAnimation />
              <button
                disabled
                type="button"
                className="absolute right-4 top-[6px]"
              >
                <i className="fa-solid fa-search"></i>
              </button>
            </Link>
          )}
          {pathname != "/search" && (
            <Link
              href="/search"
              title="Search"
              className="relative hover:bg-gray-100 mr-2 p-1 rounded px-1.5 lg:hidden text-secondary opacity-90"
            >
             <i className="fa-solid text-lg fa-search"></i>
            </Link>
          )}

          <Link
            href={userlogin ? "/wishlist" : "/login"}
            className="hidden  select-none text-primary p-1 px-1.5  hover:bg-gray-100 sm:flex justify-center items-center rounded relative  mr-3"
          >
            <i className="fa-regular fa-heart text-xl"></i>
            {userlogin && wishlist.length > 0 && (
              <span className="w-4 h-4 justify-center flex items-center rounded-full bg-green-300 absolute top-0 -right-2 text-[12px] text-secondary ">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link
            href={userlogin ? "/notification" : "/login"}
            className="select-none text-primary p-1 px-1.5  hover:bg-gray-100 flex justify-center items-center rounded relative mr-2"
          >
            <i className="fa-solid fa-bell text-xl"></i>
            {userlogin && unreadCount > 0 && (
              <span className="w-4 h-4 justify-center flex items-center rounded-full bg-green-300 absolute top-0 -right-2 text-[12px] text-secondary">
                {unreadCount}
              </span>
            )}
          </Link>

          {userlogin ? (
            <>

              <div className="py-.5 lg:py-[2px] pl-2 pr-3 sm:pl-3 sm:pr-4 rounded-full border-[1px] border-primary flex justify-center gap-3 ml-1 sm:ml-3 mr-2 items-center">
                <GiTwoCoins style={{ color: '#FFD700' }} className="text-lg sm:text-2xl" />
                <span className="text-base sm:text-lg text-primary font-medium">₹{summary?.total_cb ?? 0}</span>
              </div>


              <Link
                href="/profile"
                className={` font-medium rounded-full duration-200 mx-2 lg:ml-5 shadow cursor-pointer hover:opacity-80`}
              >
                <Image
                  src={
                    user?.profile ||
                    "https://cdn-icons-png.flaticon.com/512/9203/9203764.png"
                  }
                  alt={user?.email || "User profile"}
                  height={100}
                  width={100}
                  className="w-8 h-8 lg:w-9  lg:h-9 rounded-full"
                />
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="select-none text-secondary p-1 px-1.5 mx-3 hover:bg-gray-100 relative flex justify-center items-center gap-1 rounded"
            >
              <i className="fa-solid text-xl fa-user"></i>
              <span className="text-sm hidden lg:block text-secondary font-medium">
                Login/SignUp
              </span>
            </Link>
          )}

          <button
            onClick={showtoggle}
            className="lg:hidden p-2 text-gray-700 w-[30px] flex justify-center items-center hover:text-black"
          >
            <i className="fa-solid fa-bars text-xl" id="menu_icon"></i>
          </button>
        </div>


        {toggleMenu && (
          <div
            id="mobile-menu"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.3)", height: '100vh' }}
            className="fixed top-[0%] bottom-0 w-full z-[990]   left-0 lg:hidden "
          >
            <div className="bg-white max-w-[500px] p-4  h-screen overflow-auto  relative pt-10">
              <button onClick={showtoggle} className="absolute top-3 right-5">
                <i className="fa-solid fa-times text-xl  text-gray-700"></i>
              </button>


              <div className="flex items-center gap-4 mb-6">
                {user?.profile ? (
                  <div className="rounded-full w-[65px] h-[65px] overflow-hidden">
                    <Image
                      src={user?.profile}
                      alt="User Image"
                      width={65}
                      sizes="100vw"
                      height={65}
                      className="rounded-full w-[65px] h-[65px]"
                    />
                  </div>
                ) : (
                  <div className="w-[65px] h-[65px] bg-gray-300 rounded-full flex items-center justify-center text-3xl text-secondary font-bold">
                    {user?.name?.[0] ?? "U"}
                  </div>
                )}
                <div>
                  <h2 className="text-lg sm:text-xl capitalize font-semibold text-primary">{user?.name ?? "User"}</h2>
                  {
                    userlogin ? <Link href='/profile' className="text-gray-600 hover:underline text-sm sm:text-base">{user?.email}</Link> : <Link href='/login' className="text-gray-600 text-sm sm:text-base hover:underline">Login/Register</Link>
                  }

                </div>
              </div>

              {pathname != "/search" && (
                <Link
                  href="/search"
                  className="relative mb-5 lg:hidden inline-block w-full rounded-sm overflow-hidden"
                >

                  <SearchAnimation />
                  <button
                    type="button"
                    disabled
                    className="absolute right-4 top-[6px]"
                  >
                    <i className="fa-solid fa-search"></i>
                  </button>
                </Link>
              )}


              <div>
                <ul className="select-none shadow-sm shadow-gray-200 text-[16px] rounded-lg p-2">

                  <li className="mx-1 my-1 hover:pl-2 duration-150">
                    <Link
                   
                      className="text-gray-700 font-normal pl-2 items-center flex gap-2"
                      href={userlogin ? '/edit' : '/login'}
                    >
                      <FaUser className="text-base" />   Profile Edit
                    </Link>
                  </li>
                  <li className="mx-1 my-1 hover:pl-2 duration-150">
                    <Link
                      className="text-gray-700 items-center flex gap-2 font-normal pl-2 "
                      href={userlogin ? '/order-list' : '/login'}
                    >
                      <FaShoppingCart className="text-base" />    All Order
                    </Link>
                  </li>
                  <li className="mx-1 my-1 hover:pl-2 duration-150">
                    <Link
                   
                      className="text-gray-700 font-normal pl-2  items-center flex gap-2"
                      href={userlogin ? '/addupi' : '/login'}
                    >
                      <BsBank2 className="text-base" />   Add UPI
                    </Link>
                  </li>
                  <li className="mx-1 my-1 hover:pl-2 duration-150">
                    <Link
                      className="text-gray-700 font-normal pl-2  items-center flex gap-2"
                      href={userlogin ? '/wishlist' : '/login'}
                    >
                      <FaHeart className="text-base" /> Your Wishlist <span className="text-sm text-green-400">{userlogin && wishlist.length > 0 && <>({wishlist.length})</>}</span>
                    </Link>
                  </li>
                  <li className="mx-1 my-1 hover:pl-2 duration-150">
                    <Link
                      className="text-gray-700 font-normal pl-2  items-center flex gap-2"
                      href={userlogin ? '/notification' : '/login'}
                    >
                      <FaBell className="text-base" />  Notification <span className="text-sm text-green-400">{userlogin && unreadCount != 0 && <>({unreadCount})</>}</span>
                    </Link>
                  </li>
                  <li className="mx-1 my-1 hover:pl-2 duration-150">
                    <Link
                  
                      className="text-gray-700 font-normal pl-2  items-center flex gap-2"
                      href={userlogin ? '/withdrawal/request' : '/login'}
                    >
                      <FaMoneyBillWave className="text-base" />     Withdrawal
                    </Link>
                  </li>

                  <li className="mx-1 my-1 hover:pl-2 duration-150">
                    <Link
                    
                      className="text-gray-700 font-normal pl-2  items-center flex gap-2"
                      href={userlogin ? '/withdrawal-list' : '/login'}
                    >
                      <FaList className="text-base" />    Withdrawal list
                    </Link>
                  </li>


                  {user && ["admin", "data_editor", "blog_editor"].includes(user.role) && (
                    <li className="mx-1 my-1 hover:pl-2 duration-150">
                      <Link
                        className="text-gray-700 font-normal pl-2 items-center flex gap-2"
                        href={userlogin ? '/dashboard' : '/login'}
                      >
                        <MdDashboard className="text-base" />      Dashboard
                      </Link>
                    </li>
                  )}



                </ul>

                <ul className="select-none  mt-4 p-2">

                  <li className="mx-1 my-1 hover:pl-2 duration-150">
                    <Link
                      className="text-gray-700 font-normal pl-2  items-center flex gap-2"
                      href="/store"
                    >
                      <MdStore className="text-base" />      Cashback Store
                    </Link>
                  </li>
                  <li className="mx-1 my-1 hover:pl-2 duration-150">
                    <Link
                      className="text-gray-700 font-normal pl-2  items-center flex gap-2"
                      href="/referral-link"
                    >
                      <FaLink className="text-base" />
                     Referral
                    </Link>
                  </li>
                  <li className="mx-1 my-1 hover:pl-2 duration-150">
                    <Link
                      className="text-gray-700 font-normal pl-2  items-center flex gap-2"
                      href="/coupons"
                    >
                      <RiCoupon3Fill className="text-base" />   All Coupons
                    </Link>
                  </li>
                  <li className="mx-1 my-1 hover:pl-2 duration-150">
                    <Link
                      className="text-gray-700 font-normal pl-2  items-center flex gap-2"
                      href="/about"
                    >
                      <FcAbout className="text-base" /> About Us
                    </Link>
                  </li>
                  <li className="mx-1 my-1 hover:pl-2 duration-150">
                    <Link
                      className="text-gray-700 font-normal pl-2  items-center flex gap-2"
                      href="/blog"
                    >
                      <FaBlog className="text-base" />
                      Our Blog
                    </Link>
                  </li>
                  
                  <li className="mx-1 my-1 hover:pl-2 duration-150">

                    <Link
                      className="text-gray-700 font-normal pl-2  items-center flex gap-2"
                      href="/contact-us"
                    >
                      <FcBusinessContact className="text-base" />
                      Contact Us
                    </Link>
                  </li>
                  <li className="mx-1 my-1 hover:pl-2 duration-150">
                    <Link
                      className="text-gray-700 font-normal pl-2  items-center flex gap-2"
                      href="/faq"
                    >
                      <MdHelp className="text-base" />
                      FAQ / Help
                    </Link>
                  </li>
                </ul>
                {
                  userlogin && <ul className="select-none  mt-6 text-[18px] p-2">

                    <li className="mx-1 my-1 hover:pl-2 duration-150">
                      <button
                        onClick={logOut_user}
                        className="text-base text-red-600  font-medium hover:pl-1 cursor-pointer duration-200 my-1 ml-3 py-1 block"
                      >
                        <i className="fa-solid text-xl fa-right-from-bracket"></i> Logout
                      </button>
                    </li>
                  </ul>
                }

              </div>

            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MainHeader;
