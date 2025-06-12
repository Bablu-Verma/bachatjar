"use client";

import { ICampaign } from "@/model/CampaignModel";
import Image from "next/image";
import Link from "next/link";
import React from "react";
// import { Navigation,Autoplay, Pagination, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y, Navigation } from "swiper/modules";


interface posterProps {
  poster: ICampaign[];
}

const HomePoster: React.FC<posterProps> = ({ poster }) => {
  return (
    <div className="max-w-6xl mx-auto pt-2  relative">
      <Swiper
        loop={true}
        modules={[Autoplay, A11y, Navigation]}
        navigation={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
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
      >
        {poster.map((item, i) => (
          <SwiperSlide key={i}>
            <Link className="mx-2 inline-block" href={item.slug_type === 'INTERNAL' ? `/campaign/${item?.product_slug}` : item.store?.store_link}>
              <Image
                src={item?.long_poster[0].image}
                className="w-full h-[180px] md:h-[250px] rounded-t-md"

                height={220}
                sizes="100vw"
                width={400}
                alt={item.title}
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomePoster;
