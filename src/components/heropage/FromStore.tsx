'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Navigation } from 'swiper/modules';
import ProductCard from '../small_card/ProductCard';
import { ICampaignWithStore } from '@/common_type';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

interface FromStoreProps {
  deals: ICampaignWithStore[];
}

const FromStore: React.FC<FromStoreProps> = ({ deals }) => {
  return (
    <div className="px-1 mt-2">
      <Swiper
        spaceBetween={10}
        navigation={true}
        modules={[EffectFade, Navigation]}
        className="mySwiper"
        breakpoints={{
          320: {
            slidesPerView: 1.9,
            spaceBetween: 8,
          },
          480: {
            slidesPerView: 2.3,
            spaceBetween: 10,
          },
          640: {
            slidesPerView:3.1,
            spaceBetween: 12,
          },
          768: {
            slidesPerView: 3.5,
            spaceBetween: 14,
          },
          1024: {
            slidesPerView: 4.2,
            spaceBetween: 16,
          },
        }}
      >
        {deals.map((card_data, i) => (
          <SwiperSlide key={i} className="px-1">
            <ProductCard card_data={card_data} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FromStore;
