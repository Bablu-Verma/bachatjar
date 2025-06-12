"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, A11y } from "swiper/modules";
import Link from "next/link";
import { ICampaign } from "@/model/CampaignModel";
import Image from "next/image";


import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface BannerProps {
  banner: ICampaign[];
}

const Banner: React.FC<BannerProps> = ({ banner }) => {
  return (
    <div className="rounded col-span-5 md:col-span-4 relative">
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
                  : item.store?.store_link
              }
              className="relative h-[210px] lg:h-64 rounded bg-cover bg-center block mx-2"
            >
              <Image
               
                className="w-full h-[210px] lg:h-64 "
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
