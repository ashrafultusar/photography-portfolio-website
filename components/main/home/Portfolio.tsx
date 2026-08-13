'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const portfolioItems = [
  {
    id: 1,
    src: '/hero/1.jpg',
    alt: 'Wedding couple in outdoor nature setting',
    category: 'Wedding',
    title: 'Fatema & Rakib',
    span: 'row-span-2',
  },
  {
    id: 2,
    src: '/hero/2.jpg',
    alt: 'Bride portrait at golden hour',
    category: 'Holud',
    title: 'Nadia & Tanvir',
    span: '',
  },
  {
    id: 3,
    src: '/hero/3.jpg',
    alt: 'Nikah ceremony candid shot',
    category: 'Nikah',
    title: 'Anika & Faisal',
    span: '',
  },
  {
    id: 4,
    src: '/hero/4.jpg',
    alt: 'Couple reception photography',
    category: 'Reception',
    title: 'Sara & Hasan',
    span: 'row-span-2',
  },
  {
    id: 5,
    src: '/hero/3.jpg',
    alt: 'Bridal portrait',
    category: 'Holud',
    title: 'Riya & Imran',
    span: '',
  },
  {
    id: 6,
    src: '/hero/1.jpg',
    alt: 'Wedding reception dance',
    category: 'Wedding',
    title: 'Mim & Sabbir',
    span: '',
  },
];

const categories = ['All', 'Wedding', 'Holud', 'Nikah', 'Reception'];

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === 'All'
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showPrev = useCallback(() =>
    setLightboxIndex((prev) => prev === null ? null : (prev - 1 + filtered.length) % filtered.length),
    [filtered.length]
  );
  const showNext = useCallback(() =>
    setLightboxIndex((prev) => prev === null ? null : (prev + 1) % filtered.length),
    [filtered.length]
  );

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
    <section
      id="portfolio"
      className="relative w-full bg-neutral-900 py-28 px-6 md:px-12 overflow-hidden"
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6">
          <div className="space-y-3">
            <p className="text-xs tracking-[0.4em] uppercase text-red-600 font-sans">
              Our Portfolio
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-white">
              Frames We&apos;re <em className="not-italic text-red-500">Proud</em> Of
            </h2>
            <div className="w-12 h-px bg-red-700" />
          </div>

          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs tracking-widest uppercase font-sans px-5 py-2 border transition-all duration-300 cursor-pointer ${activeCategory === cat
                  ? 'bg-red-700 border-red-700 text-white'
                  : 'border-white/20 text-gray-400 hover:border-white/50 hover:text-white'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-[220px]">
          {filtered.map(({ id, src, alt, category, title, span }, index) => (
            <div
              key={id}
              onClick={() => openLightbox(index)}
              className={`relative overflow-hidden group rounded-sm cursor-zoom-in ${span}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <span className="text-red-400 text-[10px] tracking-[0.3em] uppercase font-sans block mb-1">
                  {category}
                </span>
                <p className="text-white font-serif text-lg">{title}</p>
              </div>

              {/* Corner accent */}
              <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-3 text-xs tracking-widest uppercase font-sans text-white border border-white/20 px-10 py-4 hover:bg-white hover:text-black transition-all duration-300 group"
          >
            View Full Portfolio
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>

      {/* ── Lightbox Modal ── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center"
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
            {lightboxIndex + 1} / {filtered.length}
          </span>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); showPrev(); }}
            className="absolute left-3 md:left-6 text-white/50 hover:text-white transition-colors z-10 p-3 rounded-full hover:bg-white/10"
            aria-label="Previous image"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Image container */}
          <div
            className="relative max-w-5xl max-h-[88vh] w-full mx-20 flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filtered[lightboxIndex].src}
              alt={filtered[lightboxIndex].alt}
              className="max-w-full max-h-[82vh] object-contain rounded-sm shadow-2xl"
            />
            {/* Caption */}
            <p className="mt-4 text-white/40 text-xs tracking-[0.25em] uppercase font-sans text-center select-none">
              {filtered[lightboxIndex].category} &mdash; {filtered[lightboxIndex].title}
            </p>
          </div>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); showNext(); }}
            className="absolute right-3 md:right-6 text-white/50 hover:text-white transition-colors z-10 p-3 rounded-full hover:bg-white/10"
            aria-label="Next image"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
};

export default Portfolio;
