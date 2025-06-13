'use client'

import Link from "next/link";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative, Autoplay} from 'swiper/modules';

import Image from "next/image";
import { ICampaign } from "@/model/CampaignModel";


import 'swiper/css';
import 'swiper/css/effect-creative';


interface DealOfTheDayProps{
  deals: ICampaign[];
}

const DealOfTheDay:React.FC<DealOfTheDayProps> = ({deals}) => {

  return (
    <div className=" mt-0 rounded hidden md:block col-span-2">
      <Swiper
      loop={true}
      grabCursor={true}
        effect={'creative'}
        creativeEffect={{
          prev: {
            shadow: true,
            translate: [0, 0, -400],
          },
          next: {
            translate: ['100%', 0, 0],
          },
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[EffectCreative, Autoplay]}
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
