'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Navigation } from 'swiper/modules';

import { ICampaignWithStore } from '@/common_type';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface FromStoreProps {
  deals: ICampaignWithStore[];
}

const FromStore: React.FC<FromStoreProps> = ({ deals }) => {
  return (
    <div className="px-1 mt-2">
      <Swiper
        spaceBetween={10}
        navigation={true}
        modules={[EffectFade, Navigation]}
        className="mySwiper"
        breakpoints={{
          320: {
            slidesPerView: 1.9,
            spaceBetween: 8,
          },
          480: {
            slidesPerView: 2.3,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 3.1,
            spaceBetween: 12,
          },
          768: {
            slidesPerView: 3.5,
            spaceBetween: 14,
          },
          1024: {
            slidesPerView: 4.2,
            spaceBetween: 16,
          },
        }}
      >
        {deals.map((card_data, i) => (
          <SwiperSlide key={i} className="px-1 pt-1">
            <Link 
              href={
                card_data.slug_type === "INTERNAL"
                  ? `/campaign/${card_data.product_slug ?? ''}`
                  : card_data.extrnal_url ?? '#'
              }
              target={card_data.slug_type !== "INTERNAL" ? '_blank' : '_self'}
              className="shadow-box_shadow_color hover:shadow-box_shadow_hover hover:translate-y-[-6px]  overflow-hidden inline-block rounded-lg bg-white relative duration-200 border-[1px] border-transparent hover:border-gray-100 hover:border-[1px]  group"
            >
            
              <div className=" overflow-hidden relative p-1 pb-3 sm:pb-0 sm:p-3 flex justify-center items-center">
                <Image
                  src={card_data?.product_img}
                  className="w-auto h-[150px] rounded-md"
                  height={200}
                  width={200}
                  alt={card_data?.title}
                />
              </div>

              <div className="p-2 pt-2">
                <div className="flex justify-between item-center gap-2">
                  <span className="capitalize font-normal text-xs text-gray-500 whitespace-nowrap text-ellipsis overflow-hidden">
                    <i className="fa-solid fa-store mr-1"></i>
                    {/* <i className="fa-solid fa-shop mr-1"></i> */}
                    {card_data?.store.name}
                  </span>
                  <span className="capitalize font-normal text-xs text-gray-500  whitespace-nowrap text-ellipsis overflow-hidden">
                    {/* <i className="fa-regular fa-clock mr-1"></i>
            {timeAgo} */}
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
                      ₹{card_data?.calculated_cashback.toString()} {
                        card_data.store.store_type == "INSENTIVE" ? 'CB' : 'Save'
                      }
                    </small>
                  </span>
                  <div className="flex justify-between mt-2 mb-1 items-center ">
                    <span className="text-gray-600 text-base font-medium line-through">
                      ₹{card_data?.actual_price.toString()}
                    </span>
                    <button
                      className="select-none pr-1 rounded-md text-[#2491ef] font-medium py-1 text-sm duration-200 text-nowrap ease-in-out "
                    >
                      Grab Now
                    </button>
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

export default FromStore;
