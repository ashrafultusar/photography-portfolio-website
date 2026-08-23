'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import Image from 'next/image';
import { HeroSectionData } from '@/lib/types/hero';
import { getOptimizedImageUrl } from '@/lib/imageOptimization';

interface HeroProps {
    data?: HeroSectionData;
}

const defaultImages = [
    { src: '/hero/1.jpg', alt: 'Shondhikkhon Wedding Couple Walking in Outdoor Nature Setting' },
    { src: '/hero/2.jpg', alt: 'Happy Bride and Groom Smiling During Wedding Ceremony' },
    { src: '/hero/3.jpg', alt: 'Beautiful Wedding Photography and Details' },
    { src: '/hero/4.jpg', alt: 'Beautiful Wedding Photography and Details' },
];

const Hero: React.FC<HeroProps> = ({ data }) => {
    const subtitle = data?.subtitle || 'WEDDING & EVENT PHOTOGRAPHY';
    const title = data?.title || 'The Story';
    const description = data?.description || 'Capturing your eternal moments with cinematic elegance.';
    const buttonText = data?.buttonText || 'Book Us';
    const buttonLink = data?.buttonLink || '#book-us';
    const images = data?.images && data.images.length > 0 ? data.images : defaultImages;

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
                {images.map((image, index) => (
                    <SwiperSlide key={index} className="relative w-full h-full">
                        <Image
                            src={getOptimizedImageUrl(image.src, 1600)}
                            alt={image.alt || title}
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
                <p className="text-xs md:text-sm tracking-[0.4em] uppercase text-yellow-400 mb-4 font-sans font-semibold">
                    {subtitle}
                </p>
                <h1 className="text-5xl md:text-7xl xl:text-8xl font-serif font-light text-yellow-400 leading-tight drop-shadow-md">
                    {title}
                </h1>
                <div className="w-16 h-px bg-yellow-400 my-6" />
                <p className="text-base md:text-lg text-slate-200 font-sans font-light max-w-md">
                    {description}
                </p>
                <a
                    href={buttonLink}
                    className="pointer-events-auto mt-10 px-10 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 text-xs tracking-widest uppercase font-sans font-bold transition-all duration-300 rounded-sm shadow-xl shadow-yellow-500/10"
                >
                    {buttonText}
                </a>
            </div>
        </section>
    );
};

export default Hero;