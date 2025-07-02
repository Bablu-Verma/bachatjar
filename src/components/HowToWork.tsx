'use client'

import Image from "next/image";
import React from "react";
import step_login from '../../public/step_login.png'
import step_logo from '../../public/step_logo.png'
import step_cash from '../../public/step_cash.png'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";



const HowToWork = () => {
  

  return (
    <>

      <div className="max-w-6xl mx-auto pt-2 px-2">
        <Swiper
            spaceBetween={14}
            slidesPerView={1.1}
            breakpoints={{
           420: {
            slidesPerView: 1.4,
          },
          520: {
            slidesPerView: 1.8,
          },
          768: {
            slidesPerView: 2.2,
          },
           1024: {
            slidesPerView: 3,
            spaceBetween:24
          },
        
      }}
            >
            <SwiperSlide>
              <div className='relative rounded-lg border-[1px] shadow shadow-orange-300 flex justify-start items-center py-2 px-2 mt-3 mb-1 max-w-[500px]'>
                <span className="bg-purple-500 text-white absolute right-4 -top-2 h-5 flex justify-center items-center w-5 rounded text-sm font-medium ">1</span>
                <div className="pr-4">
                  <Image src={step_login} className="w-[64px] h-auto" alt="step_login" height={100} width={100} />
                </div>
                <div className="pr-10">
                  <h3 className="text-base font-semibold text-secondary ">Log In & Shop</h3>
                  <p className="text-sm font-normal text-secondary ">Click your favourite Product &  Shop</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className='relative rounded-lg mt-3 mb-1 border-[1px] max-w-[500px] shadow shadow-orange-300 flex justify-start items-center py-2 px-2'>
                <span className="bg-purple-500 text-white  absolute right-4 -top-2 h-5 flex justify-center items-center w-5 rounded text-sm font-medium ">2</span>
                <div className="pr-4">
                  <Image className="w-[64px] h-auto" src={step_logo} alt="step_login" height={100} width={100} />
                </div>
                <div className="pr-10">
                  <h3 className="text-base font-semibold text-secondary ">Cashback Earned</h3>
                  <p className="text-sm font-normal text-secondary ">Cashback gets added your  Jar  wallet</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className='relative rounded-lg mt-3 mb-1 max-w-[500px] border-[1px] shadow shadow-orange-300 flex justify-start items-center py-2 px-2'>
                <span className="bg-purple-500 text-white  absolute right-4 -top-2 h-5 flex justify-center items-center w-5 rounded text-sm font-medium ">3</span>
                <div className="pr-4">
                  <Image className="w-[64px] h-auto" src={step_cash} alt="step_login" height={100} width={100} />
                </div>
                <div className="pr-10">
                  <h3 className="text-base font-semibold text-secondary ">Withdraw Cashback</h3>
                  <p className="text-sm font-normal text-secondary ">To your bank account, or as a voucher, recharge</p>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
      </div>
    </>
  );
};

export default HowToWork;

