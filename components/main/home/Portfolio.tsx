'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PortfolioAlbumData } from '@/lib/types/portfolio';
import { portfolioAlbums as defaultStaticAlbums } from '@/data/portfolioData';

interface PortfolioProps {
  albums?: PortfolioAlbumData[];
}

const defaultAlbumsList: PortfolioAlbumData[] = defaultStaticAlbums.map((a) => ({
  id: String(a.id),
  slug: a.slug,
  title: a.title,
  category: a.category,
  clientName: a.title,
  eventDate: a.date,
  location: a.location,
  coverImage: a.coverImage,
  description: a.description,
  featured: true,
  photoCount: a.images ? a.images.length : 0,
  images: a.images || [],
}));

const Portfolio: React.FC<PortfolioProps> = ({ albums }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const albumList = albums && albums.length > 0 ? albums : defaultAlbumsList;

  const categories = ['All', ...Array.from(new Set(albumList.map((a) => a.category)))];

  const filtered =
    activeCategory === 'All'
      ? albumList
      : albumList.filter((album) => album.category === activeCategory);

  return (
    <section
      id="portfolio"
      className="relative w-full bg-[#e2e8f0] py-28 px-6 md:px-12 overflow-hidden text-slate-800 border-t border-b border-slate-300"
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6">
          <div className="space-y-2">
            <p className="text-xs tracking-[0.4em] uppercase text-amber-600 font-sans font-bold">
              Our Portfolio
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-slate-900">
              Frames We&apos;re <em className="not-italic text-amber-600 font-medium">Proud</em> Of
            </h2>
            <div className="w-16 h-1 bg-amber-500 rounded-full" />
          </div>

          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs tracking-widest uppercase font-sans px-5 py-2.5 rounded-lg border transition-all duration-300 cursor-pointer ${activeCategory === cat
                  ? 'bg-amber-400 border-amber-500 text-slate-950 font-bold shadow-md'
                  : 'border-slate-300 text-slate-700 hover:border-amber-500 hover:text-amber-700 bg-white/80'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[220px]">
          {filtered.map((album, index) => {
            const spans = [
              'md:row-span-2',
              '',
              '',
              'md:row-span-2',
              '',
              '',
            ];
            const spanClass = spans[index % spans.length];

            return (
              <Link
                key={album.id}
                href={`/portfolio/${album.slug}`}
                className={`group relative overflow-hidden rounded-sm cursor-pointer bg-slate-200 border border-slate-300 shadow-md ${spanClass}`}
              >
                {/* Cover image */}
                <Image
                  src={album.coverImage}
                  alt={album.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={80}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent opacity-75 group-hover:opacity-90 transition-opacity duration-500" />

                {/* Photo count badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-sm border border-slate-300 opacity-90 group-hover:opacity-100 transition-opacity z-10 shadow-sm">
                  <span className="text-[10px] text-slate-900 font-mono font-bold tracking-widest">
                    {album.photoCount || album.images?.length || 0} Photos
                  </span>
                </div>

                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 z-10">
                  <span className="text-amber-400 text-[10px] tracking-[0.3em] uppercase font-sans block mb-1 font-bold">
                    {album.category}
                  </span>
                  <p className="text-white font-serif text-lg md:text-xl font-medium group-hover:text-amber-300 transition-colors">{album.title}</p>
                  <p className="text-slate-300 text-xs font-sans tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {album.eventDate} · {album.location}
                  </p>
                </div>

                {/* Corner accent */}
                <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-amber-400/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-slate-500 font-sans mt-16">No albums in this category yet.</p>
        )}

        {/* CTA */}
        <div className="text-center mt-14">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-3 text-xs tracking-widest uppercase font-sans text-slate-950 bg-amber-400 hover:bg-amber-500 font-bold px-10 py-4 rounded-sm shadow-md transition-all duration-300 group"
          >
            View Full Portfolio
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;


