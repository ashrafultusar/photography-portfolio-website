'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PortfolioAlbumData } from '@/lib/types/portfolio';
import { PortfolioAlbum } from '@/data/portfolioData';
import { getOptimizedImageUrl } from '@/lib/imageOptimization';
import { ArrowLeft } from 'lucide-react';

interface Props {
    album: PortfolioAlbumData | PortfolioAlbum;
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

    const dateStr = 'eventDate' in album ? album.eventDate : album.date;

    return (
        <main className="min-h-screen bg-[#e2e8f0] pt-28 pb-20 px-6 md:px-12 text-slate-800">
            <div className="max-w-6xl mx-auto">
                {/* Back link */}
                <Link
                    href="/portfolio"
                    className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-sans text-slate-700 hover:text-amber-700 font-bold transition-colors duration-200 mb-10 group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-200" />
                    Back to Portfolio
                </Link>

                {/* Album header */}
                <div className="mb-12 space-y-3">
                    {/* Category badge */}
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] tracking-[0.35em] uppercase font-sans text-slate-950 bg-amber-400 font-bold px-3.5 py-1 rounded-sm shadow-sm">
                            {album.category}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight">
                        {album.title}
                    </h1>

                    <p className="text-slate-700 font-sans text-sm leading-relaxed max-w-xl font-medium">
                        {album.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-600 font-sans font-medium tracking-widest">
                        {dateStr && (
                            <>
                                <span>📅 {dateStr}</span>
                                <span className="text-slate-400">•</span>
                            </>
                        )}
                        <span>📍 {album.location}</span>
                        <span className="text-slate-400">•</span>
                        <span>{album.images.length} Photos</span>
                    </div>

                    <div className="w-16 h-1 bg-amber-500 rounded-full mt-3" />
                </div>

                {/* Masonry image grid */}
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                    {album.images.map((img, index) => (
                        <div
                            key={index}
                            onClick={() => openLightbox(index)}
                            className="relative overflow-hidden group rounded-xl border border-slate-300 cursor-zoom-in break-inside-avoid mb-4 shadow-md bg-white min-h-[220px]"
                        >
                            <Image
                                src={getOptimizedImageUrl(img.src, 800)}
                                alt={img.alt || album.title}
                                width={600}
                                height={400}
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                quality={80}
                                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/40 transition-all duration-400 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">
                                    <div className="p-3 rounded-full bg-amber-400 text-slate-950 shadow-lg">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Lightbox ── */}
            {lightboxIndex !== null && (
                <div
                    className="fixed inset-0 z-[9999] bg-[#0e1116]/98 backdrop-blur-md flex items-center justify-center p-2 sm:p-6"
                    onClick={closeLightbox}
                    role="dialog"
                    aria-modal="true"
                >
                    {/* Close */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 text-slate-300 hover:text-yellow-400 transition-colors z-30 w-10 h-10 flex items-center justify-center text-2xl font-thin bg-slate-900/80 sm:bg-transparent backdrop-blur-sm rounded-full border border-slate-800 sm:border-none"
                        aria-label="Close"
                    >
                        ✕
                    </button>

                    {/* Counter */}
                    <span className="absolute top-4 left-4 sm:top-6 sm:left-6 text-yellow-400 text-xs tracking-widest font-mono select-none font-semibold z-30 bg-slate-900/80 sm:bg-transparent px-3 py-1 rounded-full border border-slate-800 sm:border-none backdrop-blur-sm">
                        {lightboxIndex + 1} / {album.images.length}
                    </span>

                    {/* Prev */}
                    <button
                        onClick={(e) => { e.stopPropagation(); showPrev(); }}
                        className="absolute left-2 sm:left-6 text-slate-300 hover:text-yellow-400 transition-all duration-200 z-30 p-2.5 sm:p-3 rounded-full bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/80 backdrop-blur-md shadow-lg"
                        aria-label="Previous"
                    >
                        <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Image Container */}
                    <div
                        className="relative w-full max-w-[96vw] sm:max-w-5xl max-h-[90vh] flex flex-col items-center justify-center px-1 sm:px-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={getOptimizedImageUrl(album.images[lightboxIndex].src, 1600)}
                            alt={album.images[lightboxIndex].alt}
                            className="max-w-full max-h-[80vh] sm:max-h-[84vh] w-auto h-auto object-contain rounded-lg shadow-2xl border border-slate-800/80"
                        />
                        {album.images[lightboxIndex].alt && (
                            <p className="mt-3 text-slate-300 text-[11px] sm:text-xs tracking-[0.2em] uppercase font-sans text-center select-none max-w-full px-2 truncate">
                                {album.images[lightboxIndex].alt}
                            </p>
                        )}
                    </div>

                    {/* Next */}
                    <button
                        onClick={(e) => { e.stopPropagation(); showNext(); }}
                        className="absolute right-2 sm:right-6 text-slate-300 hover:text-yellow-400 transition-all duration-200 z-30 p-2.5 sm:p-3 rounded-full bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/80 backdrop-blur-md shadow-lg"
                        aria-label="Next"
                    >
                        <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )}
        </main>
    );
};

export default PortfolioDetail;
