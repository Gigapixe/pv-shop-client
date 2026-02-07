"use client";

import { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import SectionLabel from "@/components/ui/SectionLabel";
import TestimonialArrowLeftIcon from "@/public/icons/TestimonialArrowLeftIcon";
import TestimonialArrowRightIcon from "@/public/icons/TestimonialArrowRightIcon";

const testimonials = [
    {
        name: "Robert Williams",
        role: "Digital Marketer – USA",
        avatar: "/assets/testimonials/robert.jpg", // change to your real image
        rating: 5,
        text:
            "I’ve ordered bulk Gmail and Twitter PVA accounts several times, and the quality has been consistent every single time. The delivery was quick and support was super responsive. Highly recommend PVASHOP!",
    },
    {
        name: "Sophia K",
        role: "E-commerce Owner – UK",
        avatar: "/assets/testimonials/sophia.jpg",
        rating: 5,
        text:
            "These PVA accounts helped me scale my marketing outreach effortlessly. Every account worked perfectly, and when I had a small query, their team solved it instantly. Fantastic service!",
    },
    {
        name: "Ramsey Mourad",
        role: "Social Media Manager – UAE",
        avatar: "/assets/testimonials/ramsey.jpg",
        rating: 5,
        text:
            "PVASHOP has become my go-to source for verified accounts. The accounts are authentic, safe, and exactly as described. 24/7 support really makes a difference!",
    },
    // Add more for nicer looping
    {
        name: "Ayesha Rahman",
        role: "Growth Marketer – BD",
        avatar: "/assets/testimonials/ayesha.jpg",
        rating: 5,
        text:
            "Fast delivery, great quality, and replacements were handled smoothly. This is the easiest way to get reliable PVA accounts for campaigns.",
    },
];

function Stars({ count = 5 }: { count?: number }) {
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: count }).map((_, i) => (
                <svg
                    key={i}
                    viewBox="0 0 24 24"
                    className="h-4 w-4 fill-[#F5B301]"
                    aria-hidden="true"
                >
                    <path d="M12 2l2.9 6.6 7.1.6-5.4 4.6 1.7 6.9L12 17.8 5.7 20.7l1.7-6.9L2 9.2l7.1-.6L12 2z" />
                </svg>
            ))}
        </div>
    );
}

export default function TestimonialsSlider() {
    const swiperRef = useRef<SwiperType | null>(null);

    return (
        <section className="w-full py-14 sm:py-20 bg-white dark:bg-background-dark">
            <div className="container mx-auto px-4">
                {/* Top row: title + nav */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                    <div className="max-w-2xl">
                        <SectionLabel className="flex justify-start">Testimonials</SectionLabel>

                        <h2 className="mt-2 text-3xl sm:text-5xl font-bold text-text-dark dark:text-background">
                            What Our Clients Say
                        </h2>

                        <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-background/70">
                            Thousands of marketers, entrepreneurs, and digital agencies trust PVASHOP
                            to power their online presence. Here’s what a few of them have to say:
                        </p>
                    </div>

                    <div>
                        {/* Nav buttons */}
                    <div className="flex items-center gap-3 lg:self-start">
                        <button
                            type="button"
                            onClick={() => swiperRef.current?.slidePrev()}
                            className="
                h-11 w-11 rounded-full border border-gray-200
                flex items-center justify-center
                text-text-dark dark:text-background
                bg-white dark:bg-background-dark-2
                hover:bg-gray-50 dark:hover:bg-background-dark
                transition
              "
                            aria-label="Previous testimonial"
                        >
                            <TestimonialArrowLeftIcon fill="none"/>
                        </button>

                        <button
                            type="button"
                            onClick={() => swiperRef.current?.slideNext()}
                            className="
                h-11 w-11 rounded-full
                flex items-center justify-center
                bg-primary text-white
                hover:opacity-95 transition
              "
                            aria-label="Next testimonial"
                        >
                           <TestimonialArrowRightIcon fill="none"/>
                        </button>
                    </div>
                    </div>
                </div>

                {/* Slider */}
                <div className="mt-10">
                    <Swiper
                        onBeforeInit={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        spaceBetween={18}
                        loop
                        slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                    >
                        {testimonials.map((t, idx) => (
                            <SwiperSlide key={`${t.name}-${idx}`}>
                                <div
                                    className="
                    h-full rounded-2xl p-6
                    bg-[#FFF5F0] dark:bg-[#282828]
                    border border-transparent dark:border-white/5
                  "
                                >
                                    <Stars count={t.rating} />

                                    <p className="mt-4 text-sm leading-relaxed text-gray-700 dark:text-background/80">
                                        “{t.text}”
                                    </p>

                                    <div className="mt-6 pt-5 border-t border-gray-200/60 dark:border-white/10 flex items-center gap-3">
                                        <div className="relative h-11 w-11 overflow-hidden rounded-full bg-white/60">
                                            <Image
                                                src={t.avatar}
                                                alt={t.name}
                                                width={44}
                                                height={44}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-text-dark dark:text-background">
                                                {t.name}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-background/60">
                                                {t.role}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}
