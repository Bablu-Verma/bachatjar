'use client'

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import {
  FiLogIn,
  FiShoppingCart,
  FiCreditCard,
  FiX,
  FiUserCheck,
  FiGift,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import { getClientCookie, setClientCookie } from "@/helpers/client/client_function";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";



const HowItWorks = () => {
const [show, setShow] = useState(false)
 const token_ = useSelector((state: RootState) => state.user.token);


const steps = [
  {
    icon: token_
      ? <FiUserCheck size={40} className="text-green-600" />
      : <FiLogIn size={40} className="text-primary" />,
    title: token_ ? "Welcome Back!" : "Log In to Your Account",
    description: token_
      ? "Your account is ready. Let’s find something amazing for you."
      : "Sign in and get ready to discover amazing deals.",
  },
  {
    icon: <FiShoppingCart size={40} className="text-primary" />,
    title: "Shop Your Favorites",
    description: "Choose from top brands and exclusive deals tailored for you.",
  },
  {
    icon: <FiCreditCard size={40} className="text-primary" />,
    title: "Earn Instant Cashback",
    description: "Receive cashback in your wallet right after every purchase.",
  },
  {
    icon: <FiGift size={40} className="text-primary" />,
    title: "Enjoy the Rewards",
    description: "Withdraw to your bank or use cashback for your next order.",
  },
];



const days_15_in_minutes = 60 * 24 * 7;
// const days_15_in_minutes = 1;

useEffect(() => {
    const hideHowItWorks = getClientCookie("hide_how_it_works")
    if (!hideHowItWorks) {
      setShow(true);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
     setClientCookie('hide_how_it_works', 'true', days_15_in_minutes );
  };


  if(!show){
     return null
  }

  return (
    <div className="max-w-6xl mx-auto pt-8 lg:pt-10 px-2 relative">

      <button
        onClick={handleClose}
        className="absolute bottom-0 left-6 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full transition p-1 shadow"
        aria-label="Close How It Works"
      >
        <FiX size={16} />
      </button>
      
      <Swiper
        spaceBetween={8}
        slidesPerView={1.1}
        breakpoints={{
          420: { slidesPerView: 1.3 },
          520: { slidesPerView: 1.9 },
          768: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.2, spaceBetween: 16 },
        }}
      >
        {steps.map((step, index) => (
          <SwiperSlide key={index}>
            <div className="relative select-none bg-white rounded-xl border border-gray-200 shadow-md flex items-start gap-4 py-4 px-4 mt-4 mb-2 max-w-[500px]">
              <span className="bg-purple-500 text-white absolute right-4 -top-3 h-6 w-6 flex items-center justify-center rounded-full text-xs font-bold shadow">
                {index + 1}
              </span>
              <div>{step.icon}</div>
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3 ">{step.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HowItWorks;
