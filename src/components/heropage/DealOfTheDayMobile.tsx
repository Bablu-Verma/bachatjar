'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import { EffectFade, Navigation } from 'swiper/modules';

import { ICampaign } from '@/model/CampaignModel';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

interface DealOfTheDayMobileProps {
  deals: ICampaign[];
}

const DealOfTheDayMobile: React.FC<DealOfTheDayMobileProps> = ({ deals }) => {
  const swiperRef = useRef<{ swiper: SwiperType } | null>(null);

  useEffect(() => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideTo(1, 0);
    }
  }, []);

  return (
    <div className="px-1 mt-2 rounded">
      <Swiper
        ref={swiperRef}
        slidesPerView={1.3}
        centeredSlides={true}
        spaceBetween={2}
        navigation={true}
        modules={[EffectFade, Navigation]}
        className="mySwiper"
      >
        {deals.map((item, i) => (
          <SwiperSlide className="!w-[320px] lg:!w-[380px] flex justify-center" key={i}>
            <Link
              href={
                item.slug_type === 'INTERNAL'
                  ? `/campaign/${item?.product_slug}`
                  : item.store?.store_link || '#'
              }
              className="relative h-[180px] lg:h-64 px-2 rounded bg-cover bg-center block"
            >
              <Image
                className="w-full h-full rounded-md"
                src={item.product_img}
                alt={item.title}
                width={400}
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
