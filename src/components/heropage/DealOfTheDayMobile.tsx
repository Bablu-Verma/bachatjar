'use client'

import Link from "next/link";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from 'swiper/modules';

import Image from "next/image";
import { ICampaign } from "@/model/CampaignModel";


import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';



interface DealOfTheDayMobileProps{
  deals: ICampaign[];
}

const DealOfTheDayMobile:React.FC<DealOfTheDayMobileProps> = ({deals}) => {

  return (
    <div className="px-1 mt-2 rounded ">
      <Swiper
       effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={1.2}
        breakpoints={{
           460: {
            slidesPerView: 1.4,
          },
          520: {
            slidesPerView: 1.6,
          },
         
        }}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
       navigation={true}
        modules={[EffectCoverflow, Navigation]}
        className=""
      >
        {deals.map((item, i) => (
          <SwiperSlide key={i}>
            <Link
              href={
                item.slug_type === "INTERNAL"
                  ? `/campaign/${item?.product_slug}`
                  : item.store?.store_link
              }
              className="relative h-48 lg:h-64 rounded bg-cover bg-center block mx-2"
            >
              <Image
                className="w-full h-[180px] rounded-md"
                src={item.product_img}
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

export default DealOfTheDayMobile;
