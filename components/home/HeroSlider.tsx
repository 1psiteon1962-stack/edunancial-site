'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles (safe in client)
import 'swiper/css';

export default function HeroSlider() {
  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Swiper spaceBetween={50} slidesPerView={1}>
        <SwiperSlide>
          <div style={{ background: '#111', color: '#fff', padding: 40 }}>
            Slide 1 – Edunancial
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div style={{ background: '#222', color: '#fff', padding: 40 }}>
            Slide 2 – Learn. Build. Scale.
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div style={{ background: '#333', color: '#fff', padding: 40 }}>
            Slide 3 – Global Growth
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
