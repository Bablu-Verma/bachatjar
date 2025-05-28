"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCardTwo from "../small_card/ProductCardTwo";
import { ICampaign } from "@/model/CampaignModel";

interface IfleasProp {
  flashSale: ICampaign[];
}

const Flash: React.FC<IfleasProp> = ({ flashSale }) => {
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swiperRef = useRef<any>(null);

  return (
    <div className="max-w-6xl mx-auto pt-2 mb-4 relative">
    
      <Swiper
        spaceBetween={14}
        slidesPerView={1.1}
        breakpoints={{
          520: {
            slidesPerView: 1.3,
          },
          768: {
            slidesPerView: 1.9,
          },
          1024: {
            slidesPerView: 2.1,
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
