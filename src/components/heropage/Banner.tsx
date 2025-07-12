"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, A11y } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";


import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ICampaignWithStore } from "@/common_type";

interface BannerProps {
  banner: ICampaignWithStore[];
}

const Banner: React.FC<BannerProps> = ({ banner }) => {
  return (
    <div className="rounded col-span-6 md:col-span-4 relative">
      <Swiper
        spaceBetween={5}
        slidesPerView={1}
        loop={true}
        modules={[ Pagination,Autoplay,  A11y]}  
        pagination={{ clickable: true }}
        onSwiper={() => ""}
        onSlideChange={() => ""}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        className="home_banner_"
      >
        {banner.map((item, i) => (
          <SwiperSlide key={i}>
            <Link
              href={
              item.slug_type === "INTERNAL"
      ? `/campaign/${item?.product_slug}`
      : (item.store as any)?.store_link || "#"

              }
              className="relative h-[190px] lg:h-64   bg-cover bg-center block mx-2"
            >
              <Image
               
                className="w-full h-[190px] lg:h-64 rounded-lg md:rounded  "
                src={item.main_banner[0].image}
                alt={item.title}
                width={900}
                 sizes="100vw"
                height={400}
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
