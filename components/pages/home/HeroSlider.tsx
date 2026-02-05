"use client";

import { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import LeftArrowIcon from "@/public/icons/LeftArrowIcon";
import RightArrowIcon from "@/public/icons/RightArrowIcon";
import ButtonArrowIcon from "@/public/icons/ButtonArrowIcon";

const slides = [
  {
    title: "Unlock Verified\nPVA & Social\nMedia Accounts",
    subtitle:
      "Discover a trusted hub for high-quality, phone-verified accounts across Gmail, Yahoo, YouTube, Twitter and more",
    cta: "Explore Our Packages",
    imageSrc: "/assets/slider.png",
  },
  {
    title: "Premium Accounts\nReady to Use",
    subtitle:
      "Fast delivery, trusted sources, and high retention. Get accounts that perform.",
    cta: "Browse Inventory",
    imageSrc: "/assets/slider.png",
  },
   {
    title: "Premium Accounts\nReady to Use",
    subtitle:
      "Fast delivery, trusted sources, and high retention. Get accounts that perform.",
    cta: "Browse inventory",
    imageSrc: "/assets/slider.png",
  },
];

export default function HeroSlider() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="w-full">
      <div className="relative w-full overflow-hidden">
        <Swiper
          modules={[Pagination, Autoplay]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          loop
          pagination={{
            el: ".hero-pagination",   // ✅ custom element
            clickable: true,
          }}
          className="w-full"
        >
          {slides.map((s, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative h-screen w-full">
                <Image
                  src={s.imageSrc}
                  alt="Hero"
                  fill
                  priority={idx === 0}
                  className="object-cover object-right"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10 dark:from-black/90 dark:via-black/60 dark:to-black/15" />

                <div className="relative z-10 h-full">
                  <div className="container mx-auto h-full px-4">
                    <div className="flex h-full items-center">
                      <div className="max-w-[520px]">
                        <h1 className="whitespace-pre-line text-2xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-white">
                          {s.title}
                        </h1>
                        <p className="mt-3 max-w-[440px] text-xs sm:text-sm lg:text-base text-white/70">
                          {s.subtitle}
                        </p>

                        <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-black/10 hover:opacity-95 transition">
                          {s.cta}
                          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full">
                            <ButtonArrowIcon fill="none" />
                          </span>
                        </button>
                      </div>
                      <div className="flex-1" />
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ✅ Put controls OUTSIDE slides so they exist once */}
        <div className="absolute bottom-6 left-0 right-0 z-30">
          <div className="container mx-auto px-4 relative flex justify-end items-center gap-3">
            <button
              aria-label="Previous slide"
              onClick={() => swiperRef.current?.slidePrev()}
              className="grid h-10 w-14 place-items-center rounded-full bg-background/30 backdrop-blur hover:bg-background/40 transition"
            >
              <LeftArrowIcon fill="none" className=" dark:text-text-dark"/>
            </button>

            {/* ✅ pagination dots container */}
           <div>
             <div className="hero-pagination flex items-center gap-1 cursor-pointer dark:text-text-dark" />
           </div>

            <button
              aria-label="Next slide"
              onClick={() => swiperRef.current?.slideNext()}
              className="grid h-10 w-14 place-items-center rounded-full bg-background/30 backdrop-blur hover:bg-background/40 transition"
            >
              <RightArrowIcon fill="none" className="dark:text-text-dark"/>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
