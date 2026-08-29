"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { TestimonialItem } from "@/lib/types/testimonial";

interface TestimonialsSliderProps {
    testimonials: TestimonialItem[];
}

export default function TestimonialsSlider({ testimonials }: TestimonialsSliderProps) {
    if (!testimonials || testimonials.length === 0) return null;

    const displayList =
        testimonials.length < 6
            ? [...testimonials, ...testimonials, ...testimonials]
            : testimonials;

    return (
        <div className="w-full relative px-2">
            <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={24}
                slidesPerView={1}
                loop={true}
                speed={800}
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                pagination={{
                    clickable: true,
                    el: ".testimonial-swiper-pagination",
                }}
                breakpoints={{
                    640: {
                        slidesPerView: 1.5,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 24,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 28,
                    },
                }}
                className="pb-14 pt-2"
            >
                {displayList.map((item, index) => (
                    <SwiperSlide key={`${item._id || index}-${index}`}>
                        <div className="h-full bg-white p-7 rounded-2xl border border-slate-200 shadow-md hover:shadow-xl hover:border-amber-500/60 transition-all duration-300 flex flex-col justify-between group">
                            {/* Top Quote Icon & Stars */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    {/* Star Rating */}
                                    <div className="flex items-center gap-1 text-amber-500 text-sm">
                                        {Array.from({ length: item.rating || 5 }).map((_, i) => (
                                            <span key={i} className="text-amber-500 font-bold">★</span>
                                        ))}
                                    </div>

                                    {/* Quote Icon */}
                                    <svg
                                        className="w-7 h-7 text-amber-500/30 group-hover:text-amber-500/60 transition-colors"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                    </svg>
                                </div>

                                {/* Comment Text */}
                                <p className="text-slate-700 text-sm sm:text-base font-sans leading-relaxed italic line-clamp-4 font-medium">
                                    "{item.comment}"
                                </p>
                            </div>

                            {/* Client Profile */}
                            <div className="flex items-center gap-3.5 pt-5 mt-4 border-t border-slate-100">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-sm shrink-0 group-hover:scale-105 transition-transform"
                                />
                                <div>
                                    <h4 className="font-serif font-bold text-slate-900 text-base tracking-wide group-hover:text-amber-700 transition-colors">
                                        {item.name}
                                    </h4>
                                    <p className="text-xs text-amber-600 font-sans tracking-widest uppercase font-bold">
                                        {item.role || "Wedding Client"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Pagination Bullet Container */}
            <div className="testimonial-swiper-pagination flex justify-center items-center gap-2 mt-4 [&_.swiper-pagination-bullet]:w-2.5 [&_.swiper-pagination-bullet]:h-2.5 [&_.swiper-pagination-bullet]:bg-slate-300 [&_.swiper-pagination-bullet-active]:!bg-amber-500 [&_.swiper-pagination-bullet-active]:!w-6 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:transition-all" />
        </div>
    );
}
