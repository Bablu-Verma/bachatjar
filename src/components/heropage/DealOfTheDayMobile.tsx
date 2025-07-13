'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Navigation } from 'swiper/modules';
import green_dot from '../../../public/green_dot.gif'


import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import { ICampaignWithStore } from '@/common_type';

interface DealOfTheDayMobileProps {
  deals: ICampaignWithStore[];
}

const DealOfTheDayMobile: React.FC<DealOfTheDayMobileProps> = ({ deals }) => {
  

  return (
    <div className="px-1 mt-2">
      <Swiper
        spaceBetween={0}
        slidesPerView={1.8}
        navigation={true}
        modules={[EffectFade, Navigation]}
        className="mySwiper"
      >
        {deals.map((card_data, i) => (
          <SwiperSlide  key={i} className='px-1'>
            <Link
              href={
                card_data.slug_type === "INTERNAL"
                  ? `/campaign/${card_data?.product_slug}`
                  : card_data.store?.store_link || "#"
              }
              target={card_data.slug_type !== "INTERNAL" ? '_blank' : '_self'}
              className="shadow-box_shadow_color hover:shadow-box_shadow_hover hover:translate-y-[-6px] bg-white overflow-hidden rounded-lg relative duration-200 border-[1px] border-transparent hover:border-gray-100 hover:border-[1px] inline-block  group "
              
            >
              <span className="absolute top-3 left-0 bg-white  py-[1px] pl-3 pr-1 text-[12px] rounded-r-sm shadow-sm text-green-600 font-medium z-10   select-none flex justify-center items-center gap-1">
                Live  <Image
                  src={green_dot}
                  className="w-6 h-6 "
                  height={200}
                  width={200}
                  alt='live'
                />
              </span>

              <div className=" overflow-hidden relative p-1 pb-3 sm:pb-0 sm:p-3 flex justify-center items-center">
                <Image
                  src={card_data?.product_img}
                  className="w-full  h-[150px] rounded-t-md"
                  height={200}
                  width={200}
                  alt={card_data?.title}
                />
              </div>

              <div className="p-2 pt-0">
                <div className="flex justify-between item-center gap-2">
                  <span className="capitalize font-normal text-xs text-gray-500 whitespace-nowrap text-ellipsis overflow-hidden">
                    <i className="fa-solid fa-store mr-1"></i>
                    {card_data?.store.name}
                  </span>

                </div>

                <h4
                  title={card_data?.title}
                  className="text-[#16171a] font-normal text-sm my-1 mb-3 capitalize line-clamp-2"
                >
                  {card_data?.title}
                </h4>
                <div className=" mt-1">
                  <span>
                    <strong className="text-primary text-lg mr-2 sm:text-xl sm:mr-3 mb-1">
                      ₹{card_data?.offer_price.toString()}/-
                    </strong>
                    <small className="text-red-500 text-[14px] sm:text-sm py-.5 px-2 border-[1px] border-red-400 ">
                      ₹{card_data?.calculated_cashback.toString()} CB
                    </small>
                  </span>
                  <div className="flex justify-between mt-2 mb-1 items-center ">
                    <span className="text-gray-600 text-base font-medium line-through">
                      ₹{card_data?.actual_price.toString()}
                    </span>
                    <button
                      className="select-none pr-1 rounded-md text-[#2491ef] font-medium py-1 text-sm duration-200 text-nowrap ease-in-out "
                    > Shop Now </button>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default DealOfTheDayMobile;
