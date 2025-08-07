'use client'

import React from "react";
import BlogCard from "../small_card/BlogCard";
import { IBlog } from "@/model/BlogModal";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

const HomeBlog: React.FC<{ blogs: IBlog[] }> = ({ blogs }) => {
  return (
    <Swiper
        spaceBetween={0}
        slidesPerView={1.8}
        navigation={true}
        modules={[EffectFade, Navigation]}
        className="mySwiper"
         breakpoints={{
          320: {
            slidesPerView: 1.9,
            spaceBetween: 5,
          },
          480: {
            slidesPerView: 2.1,
            spaceBetween: 8,
          },
          640: {
            slidesPerView: 2.9,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 3.5,
            
          },
          1024: {
            slidesPerView: 4.2,
          
          },
        }}
      >
         {blogs.map((item, i) => (
           <SwiperSlide  key={i} className='px-1'>
            <BlogCard item={item} key={i} />
          </SwiperSlide>
        ))}
         
      </Swiper>
  );
};

export default HomeBlog;
