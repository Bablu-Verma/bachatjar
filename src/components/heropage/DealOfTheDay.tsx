'use client'

import Link from "next/link";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Scrollbar, Mousewheel } from 'swiper/modules';
import 'swiper/css/effect-cards';
import Image from "next/image";
import { ICampaign } from "@/model/CampaignModel";


import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/scrollbar';
import { Rings } from "react-loader-spinner";


interface DealOfTheDayProps {
  deals: ICampaign[];
}

const DealOfTheDay: React.FC<DealOfTheDayProps> = ({ deals }) => {

  return (
    <div className=" mt-0 hidden md:block col-span-2 p-2 bg-white ">
      <div className='relative pl-10'>

        <div style={{ top: '-10px' }} className='absolute  left-0'>
          <Rings
            visible={true}
            height="40"
            width="40"
            color="#4fa94d"
            ariaLabel="rings-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
        <h1 className="text-base font-bold">Live</h1>
      </div>
      <Swiper
        loop={true}
        className=" h-[170px] lg:h-[210px] "
        // style={{ height: "210px" }}
        direction={'vertical'}
        slidesPerView={2.3}
        freeMode={true}
        scrollbar={true}
        mousewheel={true}
        modules={[FreeMode, Scrollbar, Mousewheel]}
        
      >

        {deals.map((item, i) => (
          <SwiperSlide key={i}>
            <div className="relative bg-white mb-2 py-2 px-3 rounded-md  flex justify-start gap-2 ">
              <Image
                className="w-14 lg:w-16 h-14 lg:h-16 rounded-full"
                src={item.product_img}
                alt={item.title}
                width={300}
                sizes="100vw"
                height={300}
              />
              <div>
                <h2 className='line-clamp-1 lg:line-clamp-2 text-[14px] text-secondary'>{item.title}</h2>
                <div className="flex justify-between pt-1">
                  <h3 className="text-base font-bold">₹{item.offer_price}/-</h3>
                  <Link
                    className="text-sm text-primary opacity-75 hover:opacity-100"
                    href={
                      item.slug_type === "INTERNAL"
                        ? `/campaign/${item?.product_slug}`
                        : item.store?.store_link
                    }
                  >
                    Grab Now
                  </Link>
                </div>
              </div>


            </div>
          </SwiperSlide>
        ))}

      </Swiper>
    </div>
  );
};

export default DealOfTheDay;


