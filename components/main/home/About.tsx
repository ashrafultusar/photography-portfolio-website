'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Camera, Heart, Star, Award, Film, Clock, MapPin, Users, LucideIcon } from 'lucide-react';
import { HomeAboutData } from '@/lib/types/about';

const ICON_MAP: Record<string, LucideIcon> = {
    camera: Camera,
    film: Film,
    heart: Heart,
    award: Award,
    clock: Clock,
    'map-pin': MapPin,
    star: Star,
    users: Users,
};

const DEFAULT_STATS = [
    { icon: 'camera', value: '500+', label: 'Stories Told' },
    { icon: 'heart', value: '8+', label: 'Years of Love' },
    { icon: 'star', value: '4.9', label: 'Client Rating' },
    { icon: 'award', value: '12+', label: 'Awards Won' },
];

interface AboutProps {
    data?: HomeAboutData;
}

const About: React.FC<AboutProps> = ({ data }) => {
    const sectionRef = useRef<HTMLElement>(null);

    const eyebrow = data?.eyebrow || 'Our Story';
    const heading = data?.heading || "We Don't Just Take Photos, We Craft Timeless Memories";
    const description1 = data?.description1 || "The Story is Dhaka's premier wedding photography studio, blending cinematic storytelling with authentic emotion. Every shutter click is a promise — to preserve the warmth, joy, and tears that make your day irreplaceable.";
    const description2 = data?.description2 || "From intimate nikahs to grand wedding celebrations, we bring the same obsessive attention to light, composition, and feeling that transforms fleeting moments into heirlooms.";
    const sinceYear = data?.sinceYear || '2016';
    const image1 = data?.image1 || '/hero/1.jpg';
    const image2 = data?.image2 || '/hero/2.jpg';
    const ctaText = data?.ctaText || 'Meet Our Team';
    const ctaLink = data?.ctaLink || '/about';
    const statsList = data?.stats && data.stats.length > 0 ? data.stats : DEFAULT_STATS;

    return (
        <section
            ref={sectionRef}
            id="about"
            className="relative w-full bg-[#f8fafc] overflow-hidden text-slate-800"
        >
            {/* Top decorative border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-28">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* ── Left: Image collage ── */}
                    <div className="relative h-[520px] hidden lg:block">
                        {/* Large image */}
                        <div className="absolute top-0 left-0 w-[68%] h-[75%] overflow-hidden rounded-sm shadow-2xl">
                            <Image
                                src={image1}
                                alt="Wedding photography by The Story"
                                fill
                                sizes="(max-width: 1024px) 0px, 45vw"
                                className="object-cover object-center"
                            />
                            <div className="absolute inset-0 bg-black/5" />
                        </div>

                        {/* Small image – bottom right */}
                        <div className="absolute bottom-0 right-0 w-[48%] h-[50%] overflow-hidden rounded-sm shadow-2xl border border-slate-300">
                            <Image
                                src={image2}
                                alt="Bride portrait"
                                fill
                                sizes="(max-width: 1024px) 0px, 25vw"
                                className="object-cover object-center"
                            />
                        </div>

                        {/* Accent card – floating stats */}
                        <div className="absolute bottom-[42%] right-[2%] bg-white/95 backdrop-blur-sm border border-slate-300 rounded-sm px-5 py-4 shadow-xl">
                            <p className="text-amber-600 text-xs tracking-widest uppercase font-sans mb-1 font-bold">Since</p>
                            <p className="text-slate-900 text-3xl font-serif font-bold">{sinceYear}</p>
                        </div>

                        {/* Decorative corner lines */}
                        <div className="absolute top-[-1rem] left-[-1rem] w-12 h-12 border-t border-l border-amber-500/60" />
                        <div className="absolute bottom-[-1rem] right-[-1rem] w-12 h-12 border-b border-r border-amber-500/60" />
                    </div>

                    {/* ── Right: Text content ── */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <p className="text-xs tracking-[0.4em] uppercase text-amber-600 font-sans font-bold">
                                {eyebrow}
                            </p>
                            <h2 className="text-4xl md:text-5xl font-serif font-medium text-slate-900 leading-snug whitespace-pre-line">
                                {heading}
                            </h2>
                            <div className="w-16 h-1 bg-amber-500 rounded-full mt-2" />
                        </div>

                        <p className="text-slate-700 font-sans text-base leading-relaxed max-w-lg font-medium">
                            {description1}
                        </p>

                        {description2 && (
                            <p className="text-slate-600 font-sans text-sm leading-relaxed max-w-lg">
                                {description2}
                            </p>
                        )}

                        {/* Stats grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4">
                            {statsList.map((st, i) => {
                                const IconComponent = ICON_MAP[st.icon] || Camera;
                                return (
                                    <div key={i} className="group text-center space-y-2 p-3 bg-slate-200/60 border border-slate-300 rounded-sm shadow-sm">
                                        <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-amber-400/20 border border-amber-500/40 group-hover:bg-amber-400 transition-colors duration-300">
                                            <IconComponent size={16} className="text-amber-700 group-hover:text-slate-950" />
                                        </div>
                                        <p className="text-2xl font-serif text-slate-900 font-bold">{st.value}</p>
                                        <p className="text-xs text-slate-600 uppercase tracking-widest font-sans font-medium">{st.label}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <a
                            href={ctaLink}
                            className="inline-flex items-center gap-3 mt-2 text-xs tracking-widest uppercase font-sans text-amber-700 border-b-2 border-amber-500 hover:border-amber-600 hover:text-amber-800 pb-1 font-bold transition-all duration-300 group"
                        >
                            {ctaText}
                            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom decorative border */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        </section>
    );
};

export default About;

