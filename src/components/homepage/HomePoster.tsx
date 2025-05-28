"use client";

import { ICampaign } from "@/model/CampaignModel";
import Image from "next/image";
import Link from "next/link";
import React from "react";
// import { Navigation,Autoplay, Pagination, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface posterProps {
  poster: ICampaign[];
}

const HomePoster: React.FC<posterProps> = ({ poster }) => {
  return (
    <div className="max-w-6xl mx-auto px-2 lg:px-4 pt-2 mb-4 relative">
      <Swiper
    //   loop={true}
    //   modules={[Autoplay, A11y]}
    //   pagination={{ clickable: true }}
      onSwiper={() => ''}
      onSlideChange={() => ''}
    //   autoplay={{
    //     delay: 2500,
    //     disableOnInteraction: false,
    //   }}
        spaceBetween={20}
        slidesPerView={1.2}
        className="home_flash_"
      >
        {poster.map((item, i) => (
          <SwiperSlide  key={i}>
            <Link href={item.slug_type === 'INTERNAL' ? `/campaign/${item?.product_slug}` : item.redirect_url}>
              <Image
                src={item?.long_poster[0].image}
                className="w-full h-[180px] md:h-[250px] rounded-t-md"
                height={200}
                width={200}
                sizes="100vw"
                alt="shose"
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomePoster;
