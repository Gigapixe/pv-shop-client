"use client";

import ProductLikeCard from "@/components/product/ProductLikeCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRef } from "react";
import "swiper/css";
import { useTranslations } from "next-intl";

interface YouMayLikeProduct {
  _id: string;
  slug: string;
  title: {
    en: string;
  };
  image: string[];
  countrySupport?: string;
  prices: {
    price: number;
  };
}

interface YouMayLikeProps {
  youMayLike?: YouMayLikeProduct[];
}

export default function YouMayLike({ youMayLike }: YouMayLikeProps) {
  const t = useTranslations("product");
  // Reference for Swiper instance
  const swiperRef = useRef<import("swiper").Swiper | null>(null);

  // Initialize Swiper
  const handleSwiperInit = (swiper: any) => {
    swiperRef.current = swiper;
  };

  // Navigate to previous slide
  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  // Navigate to next slide
  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  if (!youMayLike || youMayLike.length === 0) {
    return null;
  }

  return (
    <div className="w-full container mx-auto py-8 relative">
      <h2 className="text-2xl font-extrabold mb-4 dark:text-white">
        {t("youMayAlsoLike")}
      </h2>
      <Swiper
        onSwiper={handleSwiperInit}
        grabCursor={true}
        loop={youMayLike?.length > 5}
        breakpoints={{
          280: { slidesPerView: 2, spaceBetween: 10 },
          500: { slidesPerView: 3, spaceBetween: 15 },
          900: { slidesPerView: 5, spaceBetween: 20 },
          1400: { slidesPerView: 6, spaceBetween: 20 },
          1536: { slidesPerView: 7, spaceBetween: 20 },
        }}
        className="py-8"
      >
        {youMayLike?.map((product) => (
          <SwiperSlide key={product._id}>
            <ProductLikeCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Left arrow button */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-0 transform rotate-180 -translate-y-1/2 z-10 bg-primary p-2 rounded-full shadow-md hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 dark:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-200"
      >
        <svg
          width="20"
          height="18"
          viewBox="0 0 20 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.5888 1.11221L18.4275 8.95092L10.5888 16.7896M17.3388 8.95098L1.44356 8.95097"
            stroke="white"
            strokeWidth="1.4857"
            strokeMiterlimit="10"
            strokeLinecap="square"
          />
        </svg>
      </button>

      {/* Right arrow button */}
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10 bg-primary p-2 rounded-full shadow-md hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 dark:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-200"
      >
        <svg
          width="20"
          height="18"
          viewBox="0 0 20 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.5888 1.11221L18.4275 8.95092L10.5888 16.7896M17.3388 8.95098L1.44356 8.95097"
            stroke="white"
            strokeWidth="1.4857"
            strokeMiterlimit="10"
            strokeLinecap="square"
          />
        </svg>
      </button>
    </div>
  );
}
