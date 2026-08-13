'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import Image from 'next/image';

const sliderImages = [
    {
        id: 1,
        src: '/hero/1.jpg',
        alt: 'Shondhikkhon Wedding Couple Walking in Outdoor Nature Setting',
    },
    {
        id: 2,
        src: '/hero/2.jpg',
        alt: 'Happy Bride and Groom Smiling During Wedding Ceremony',
    },
    {
        id: 3,
        src: '/hero/3.jpg',
        alt: 'Beautiful Wedding Photography and Details',
    },
    {
        id: 4,
        src: '/hero/4.jpg',
        alt: 'Beautiful Wedding Photography and Details',
    },
];

const Hero = () => {
    return (
        <section
            className="relative w-full h-screen overflow-hidden font-serif"
            aria-label="Hero Image Slider"
        >
            {/* Full-screen Swiper slider */}
            <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                pagination={{
                    clickable: true,
                    bulletClass: 'swiper-pagination-bullet custom-bullet',
                    bulletActiveClass:
                        'swiper-pagination-bullet-active custom-bullet-active',
                }}
                effect="fade"
                speed={1000}
                loop={true}
                className="w-full h-full hero-swiper"
            >
                {sliderImages.map((image, index) => (
                    <SwiperSlide key={image.id} className="relative w-full h-full">
                        <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            /* Only first image gets priority for fast LCP */
                            priority={index === 0}
                            sizes="100vw"
                            quality={80}
                            className="object-cover object-center"
                        />
                        {/* Dark overlay */}
                        <div
                            className="absolute inset-0 bg-black/30"
                            aria-hidden="true"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Hero text overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
                <p className="text-xs md:text-sm tracking-[0.4em] uppercase text-gray-300 mb-4 font-sans">
                    Wedding &amp; Event Photography
                </p>
                <h1 className="text-5xl md:text-7xl xl:text-8xl font-serif font-light text-white leading-tight">
                    The Story
                </h1>
                <div className="w-16 h-px bg-red-600 my-6" />
                <p className="text-base md:text-lg text-gray-300 font-sans font-light max-w-md">
                    Capturing your eternal moments with cinematic elegance.
                </p>
                <a
                    href="#book-us"
                    className="pointer-events-auto mt-10 px-10 py-3 border border-white text-white text-xs tracking-widest uppercase font-sans hover:bg-white hover:text-black transition-all duration-300"
                >
                    Book Us
                </a>
            </div>
        </section>
    );
};

export default Hero;