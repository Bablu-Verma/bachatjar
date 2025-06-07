"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import { ICampaign } from "@/model/CampaignModel";
import Image from "next/image";

interface BannerProps {
  banner: ICampaign[];
}

const Banner: React.FC<BannerProps> = ({ banner }) => {
  return (
    <div className="rounded col-span-5 lg:col-span-4 relative">
      <Swiper
        spaceBetween={5}
        slidesPerView={1}
        loop={true}
        modules={[Autoplay, Pagination, A11y]}
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
              className="relative h-48 lg:h-60 rounded bg-cover bg-center block mx-2"
            >
              <Image
                sizes="(max-width: 1100px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full h-48 lg:h-60"
                src={item.main_banner[0].image}
                alt={item.title}
                width={900}
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
