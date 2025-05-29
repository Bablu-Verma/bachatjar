"use client";

import React, { useRef } from "react";
import { ICampaign } from "@/model/CampaignModel";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCardThree from "../small_card/ProductCardThree";

interface SellingProps {
  best_product:ICampaign[]
}
const BestSalling:React.FC<SellingProps > = ({best_product}) => {
  
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const swiperRef = useRef<any>(null);

  return (
    <div className="max-w-6xl mx-auto pt-2 mb-4 px-2 relative">
    
    <Swiper
      spaceBetween={10}
      slidesPerView={1.1}
      breakpoints={{
        520: {
          slidesPerView: 1.4,
        },
        768: {
          slidesPerView: 2.5,
        },
        1024: {
          slidesPerView: 3.3,
        },
      }}
      onSwiper={(swiper) => (swiperRef.current = swiper)}
      // onSlideChange={() => console.log("slide change")}
      className="home_flash_"
    >
      {best_product.length > 0 &&
        best_product.map((item, i) => (
          <SwiperSlide key={i}>
            <ProductCardThree card_data={item} />
          </SwiperSlide>
        ))}
    </Swiper>
  </div>
  );
};

export default BestSalling;
