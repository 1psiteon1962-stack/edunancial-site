'use client';

import dynamic from 'next/dynamic';

const SwiperComponent = dynamic(
  async () => {
    const mod = await import('swiper/react');
    return mod.Swiper;
  },
  { ssr: false }
);

const SwiperSlideComponent = dynamic(
  async () => {
    const mod = await import('swiper/react');
    return mod.SwiperSlide;
  },
  { ssr: false }
);

export default function HeroSlider() {
  return (
    <div>
      <SwiperComponent>
        <SwiperSlideComponent>
          <div>Slide 1</div>
        </SwiperSlideComponent>
        <SwiperSlideComponent>
          <div>Slide 2</div>
        </SwiperSlideComponent>
      </SwiperComponent>
    </div>
  );
}
