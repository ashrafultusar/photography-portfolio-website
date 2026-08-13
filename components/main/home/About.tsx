'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Camera, Heart, Star, Award } from 'lucide-react';

const stats = [
    { icon: Camera, value: '500+', label: 'Stories Told' },
    { icon: Heart, value: '8+', label: 'Years of Love' },
    { icon: Star, value: '4.9', label: 'Client Rating' },
    { icon: Award, value: '12+', label: 'Awards Won' },
];

const About = () => {
    const sectionRef = useRef<HTMLElement>(null);

    return (
        <section
            ref={sectionRef}
            id="about"
            className="relative w-full bg-neutral-950 overflow-hidden"
        >
            {/* Top decorative border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-700/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-28">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* ── Left: Image collage ── */}
                    <div className="relative h-[520px] hidden lg:block">
                        {/* Large image */}
                        <div className="absolute top-0 left-0 w-[68%] h-[75%] overflow-hidden rounded-sm shadow-2xl">
                            <Image
                                src="/hero/1.jpg"
                                alt="Wedding photography by The Story"
                                fill
                                sizes="(max-width: 1024px) 0px, 45vw"
                                className="object-cover object-center"
                            />
                            <div className="absolute inset-0 bg-black/10" />
                        </div>

                        {/* Small image – bottom right */}
                        <div className="absolute bottom-0 right-0 w-[48%] h-[50%] overflow-hidden rounded-sm shadow-2xl border border-white/5">
                            <Image
                                src="/hero/2.jpg"
                                alt="Bride portrait"
                                fill
                                sizes="(max-width: 1024px) 0px, 25vw"
                                className="object-cover object-center"
                            />
                        </div>

                        {/* Accent card – floating stats */}
                        <div className="absolute bottom-[42%] right-[2%] bg-neutral-900/90 backdrop-blur-sm border border-white/10 rounded-sm px-5 py-4 shadow-xl">
                            <p className="text-red-500 text-xs tracking-widest uppercase font-sans mb-1">Since</p>
                            <p className="text-white text-3xl font-serif font-light">2016</p>
                        </div>

                        {/* Decorative corner lines */}
                        <div className="absolute top-[-1rem] left-[-1rem] w-12 h-12 border-t border-l border-red-700/40" />
                        <div className="absolute bottom-[-1rem] right-[-1rem] w-12 h-12 border-b border-r border-red-700/40" />
                    </div>

                    {/* ── Right: Text content ── */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <p className="text-xs tracking-[0.4em] uppercase text-red-600 font-sans">
                                Our Story
                            </p>
                            <h2 className="text-4xl md:text-5xl font-serif font-light text-white leading-snug">
                                We Don&apos;t Just Take
                                <br />
                                <em className="not-italic text-red-500">Photos,</em> We Craft
                                <br />
                                Timeless Memories
                            </h2>
                            <div className="w-12 h-px bg-red-700 mt-2" />
                        </div>

                        <p className="text-gray-400 font-sans text-base leading-relaxed max-w-lg">
                            The Story is Dhaka&apos;s premier wedding photography studio, blending
                            cinematic storytelling with authentic emotion. Every shutter click
                            is a promise — to preserve the warmth, joy, and tears that make
                            your day irreplaceable.
                        </p>

                        <p className="text-gray-500 font-sans text-sm leading-relaxed max-w-lg">
                            From intimate nikahs to grand wedding celebrations, we bring the
                            same obsessive attention to light, composition, and feeling that
                            transforms fleeting moments into heirlooms.
                        </p>

                        {/* Stats grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4">
                            {stats.map(({ icon: Icon, value, label }) => (
                                <div key={label} className="group text-center space-y-2">
                                    <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full border border-white/10 group-hover:border-red-700/50 transition-colors duration-300">
                                        <Icon size={16} className="text-red-600" />
                                    </div>
                                    <p className="text-2xl font-serif text-white">{value}</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest font-sans">{label}</p>
                                </div>
                            ))}
                        </div>

                        <a
                            href="/about"
                            className="inline-flex items-center gap-3 mt-2 text-xs tracking-widest uppercase font-sans text-white border-b border-white/20 hover:border-red-600 hover:text-red-500 pb-1 transition-all duration-300 group"
                        >
                            Meet Our Team
                            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom decorative border */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-700/30 to-transparent" />
        </section>
    );
};

export default About;
