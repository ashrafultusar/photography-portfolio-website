'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PortfolioAlbum } from '@/data/portfolioData';
import { ArrowLeft } from 'lucide-react';

interface Props {
    album: PortfolioAlbum;
}

const PortfolioDetail = ({ album }: Props) => {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const openLightbox = (i: number) => setLightboxIndex(i);
    const closeLightbox = useCallback(() => setLightboxIndex(null), []);

    const showPrev = useCallback(() =>
        setLightboxIndex((prev) =>
            prev === null ? null : (prev - 1 + album.images.length) % album.images.length
        ), [album.images.length]);

    const showNext = useCallback(() =>
        setLightboxIndex((prev) =>
            prev === null ? null : (prev + 1) % album.images.length
        ), [album.images.length]);

    useEffect(() => {
        if (lightboxIndex === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [lightboxIndex, closeLightbox, showPrev, showNext]);

    useEffect(() => {
        document.body.style.overflow = lightboxIndex !== null ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [lightboxIndex]);

    return (
        <main className="min-h-screen bg-neutral-950 pt-28 pb-20 px-6 md:px-12">
            <div className="max-w-6xl mx-auto">
                {/* Back link */}
                <Link
                    href="/portfolio"
                    className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-sans text-gray-400 hover:text-white transition-colors duration-200 mb-10 group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-200" />
                    Back to Portfolio
                </Link>

                {/* Album header */}
                <div className="mb-12 space-y-3">
                    {/* Category badge */}
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] tracking-[0.35em] uppercase font-sans text-white bg-red-700 px-3 py-1">
                            {album.category}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-serif font-light text-white">
                        {album.title}
                    </h1>

                    <p className="text-gray-400 font-sans text-sm leading-relaxed max-w-xl">
                        {album.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-gray-500 font-sans tracking-widest">
                        <span>📅 {album.date}</span>
                        <span className="text-gray-700">•</span>
                        <span>📍 {album.location}</span>
                        <span className="text-gray-700">•</span>
                        <span>{album.images.length} Photos</span>
                    </div>

                    <div className="w-10 h-px bg-red-700 mt-2" />
                </div>

                {/* Masonry image grid */}
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
                    {album.images.map((img, index) => (
                        <div
                            key={index}
                            onClick={() => openLightbox(index)}
                            className="relative overflow-hidden group rounded-sm border border-white/5 cursor-zoom-in break-inside-avoid mb-3"
                        >
                            <img
                                src={img.src}
                                alt={img.alt}
                                loading="lazy"
                                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-400 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <svg className="w-8 h-8 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Lightbox ── */}
            {lightboxIndex !== null && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/97 backdrop-blur-sm flex items-center justify-center"
                    onClick={closeLightbox}
                    role="dialog"
                    aria-modal="true"
                >
                    {/* Close */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-5 right-6 text-white/60 hover:text-white transition-colors z-10 w-10 h-10 flex items-center justify-center text-2xl font-thin"
                        aria-label="Close"
                    >
                        ✕
                    </button>

                    {/* Counter */}
                    <span className="absolute top-6 left-6 text-white/40 text-xs tracking-widest font-sans select-none">
                        {lightboxIndex + 1} / {album.images.length}
                    </span>

                    {/* Prev */}
                    <button
                        onClick={(e) => { e.stopPropagation(); showPrev(); }}
                        className="absolute left-3 md:left-6 text-white/50 hover:text-white transition-colors z-10 p-3 rounded-full hover:bg-white/10"
                        aria-label="Previous"
                    >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Image */}
                    <div
                        className="relative max-w-5xl max-h-[88vh] w-full mx-20 flex flex-col items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={album.images[lightboxIndex].src}
                            alt={album.images[lightboxIndex].alt}
                            className="max-w-full max-h-[83vh] object-contain rounded-sm shadow-2xl"
                        />
                        <p className="mt-4 text-white/35 text-xs tracking-[0.25em] uppercase font-sans text-center select-none">
                            {album.images[lightboxIndex].alt}
                        </p>
                    </div>

                    {/* Next */}
                    <button
                        onClick={(e) => { e.stopPropagation(); showNext(); }}
                        className="absolute right-3 md:right-6 text-white/50 hover:text-white transition-colors z-10 p-3 rounded-full hover:bg-white/10"
                        aria-label="Next"
                    >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )}
        </main>
    );
};

export default PortfolioDetail;
