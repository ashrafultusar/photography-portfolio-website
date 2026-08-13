'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { portfolioAlbums } from '@/data/portfolioData';

const allCategories = ['All', ...Array.from(new Set(portfolioAlbums.map((a) => a.category)))];

const PortfolioGallery = () => {
    const [active, setActive] = useState('All');

    const filtered = active === 'All'
        ? portfolioAlbums
        : portfolioAlbums.filter((a) => a.category === active);

    return (
        <section className="w-full bg-neutral-950 py-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {allCategories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActive(cat)}
                            className={`px-5 py-2 text-xs tracking-widest uppercase font-sans border transition-all duration-300 rounded-sm ${active === cat
                                ? 'bg-red-700 border-red-700 text-white'
                                : 'border-white/20 text-gray-400 hover:border-white/50 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Album Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((album) => (
                        <Link
                            key={album.id}
                            href={`/portfolio/${album.slug}`}
                            className="group block relative overflow-hidden rounded-sm border border-white/5 cursor-pointer"
                        >
                            {/* Cover image */}
                            <div className="relative h-72 overflow-hidden">
                                <img
                                    src={album.coverImage}
                                    alt={album.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                                    style={{ transform: 'scale(1)', transition: 'transform 0.7s ease' }}
                                />
                                {/* Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* Photo count badge */}
                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-sm">
                                    <span className="text-[10px] text-white/70 font-sans tracking-widest">
                                        {album.images.length} Photos
                                    </span>
                                </div>

                                {/* Category badge */}
                                <div className="absolute top-3 left-3">
                                    <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-white bg-red-700/90 px-2 py-1">
                                        {album.category}
                                    </span>
                                </div>
                            </div>

                            {/* Info bar */}
                            <div className="bg-neutral-900 px-5 py-4 flex items-center justify-between group-hover:bg-neutral-800 transition-colors duration-300">
                                <div>
                                    <p className="text-white font-serif text-lg leading-tight">{album.title}</p>
                                    <p className="text-gray-500 text-xs font-sans tracking-widest mt-0.5">{album.date} · {album.location}</p>
                                </div>
                                <div className="text-red-600 group-hover:translate-x-1 transition-transform duration-300">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <p className="text-center text-gray-500 font-sans mt-16">No albums in this category yet.</p>
                )}
            </div>
        </section>
    );
};

export default PortfolioGallery;
