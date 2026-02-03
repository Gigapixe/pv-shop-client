"use client";
import ProductsCarouselSkeleton from "./ProductsCarouselSkeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import ProductCard from "../product/ProductCard";
import { useRef, useState, useEffect } from "react";

export default function ProductsCarousel({ products }: { products: any[] }) {
  const [isReady, setIsReady] = useState(false);

  // Transform the products data to match ProductCard's expected Product type
  const formattedProducts = products?.map((product) => ({
    // title can be {en, zh} object from API — prefer English then fallback
    title:
      typeof product.title === "string"
        ? product.title
        : (product.title?.en ?? product.title?.zh ?? ""),
    slug: product.slug,
    // API returns `image` as an array; use first image when available
    image: Array.isArray(product.image) ? product.image[0] : product.image,
    // keep original `prices` object and also provide `DigitalPrice` for backward compatibility
    prices: product.prices,
    DigitalPrice: { price: product.prices?.price },
    stock: product.stock,
    type: product.type,
    isStock: product.isStock,
    _id: product._id,
    id: product.id,
    category: product.category,
    paymentMethods: product.paymentMethods,
  }));

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

  // Wait until products are loaded and have at least 1 item
  useEffect(() => {
    if (formattedProducts && formattedProducts.length > 0) {
      setIsReady(true);
    }
  }, [formattedProducts]);

  if (!isReady) {
    return <ProductsCarouselSkeleton />;
  }

  return (
    <div className="w-full container mx-auto py-8 relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={16}
        breakpoints={{
          340: {
            slidesPerView: 2,
            spaceBetween: 8,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 12,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: 6,
            spaceBetween: 16,
          },
          1280: {
            slidesPerView: 7,
            spaceBetween: 16,
          },
        }}
        onSwiper={handleSwiperInit}
        loop={true}
        // pagination={{
        //   clickable: true,
        //   el: ".swiper-pagination",
        // }}
        className="mySwiper"
      >
        {formattedProducts.map((product) => (
          <SwiperSlide key={product.slug}>
            <ProductCard product={product} className="w-full min-h-67.5" />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiper-pagination mt-4"></div>
      {/* Left arrow button */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-0 transform rotate-180 -translate-y-1/2 z-10 bg-primary p-2 rounded-full shadow-md hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 dark:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-200 "
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
