"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCardTwo from "../small_card/ProductCardTwo";

import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { ICampaignWithStore } from "@/common_type";

interface IfleasProp {
  flashSale: ICampaignWithStore[];
}

const Flash: React.FC<IfleasProp> = ({ flashSale }) => {
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swiperRef = useRef<any>(null);

  return (
    <div className="max-w-6xl mx-auto pt-2  flash_swiper relative">
    
      <Swiper
        navigation={true} modules={[Navigation]}
        spaceBetween={0}
        slidesPerView={1.1}
        breakpoints={{
           420: {
            slidesPerView: 1.4,
          },
          520: {
            slidesPerView: 1.8,
          },
          768: {
            slidesPerView: 2.3,
          },
          1024: {
            slidesPerView: 3.1,
          },
        }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        // onSlideChange={() => console.log("slide change")}
        className="home_flash_"
      >
        {flashSale.length > 0 &&
          flashSale.map((item, i) => (
            <SwiperSlide key={i}>
              <ProductCardTwo card_data={item} />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default Flash;
