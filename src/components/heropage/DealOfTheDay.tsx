'use client'

import Link from "next/link";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow} from 'swiper/modules';

import Image from "next/image";
import { ICampaign } from "@/model/CampaignModel";


import 'swiper/css';
import 'swiper/css/effect-coverflow';


interface DealOfTheDayProps{
  deals: ICampaign[];
}

const DealOfTheDay:React.FC<DealOfTheDayProps> = ({deals}) => {

  return (
    <div className=" mt-0 rounded hidden md:block col-span-1">
      <Swiper
      loop={true}
       effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        
        modules={[EffectCoverflow]}
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
                className="w-full h-64 rounded-md"
                src={item.product_img}
                alt={item.title}
                width={300}
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

export default DealOfTheDay;
