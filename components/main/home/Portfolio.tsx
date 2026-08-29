'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PortfolioAlbumData } from '@/lib/types/portfolio';
import { portfolioAlbums as defaultStaticAlbums } from '@/data/portfolioData';
import { PortfolioCard } from '@/components/main/portfolio/PortfolioCard';

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

  const filtered = (
    activeCategory === 'All'
      ? albumList
      : albumList.filter((album) => album.category === activeCategory)
  ).slice(0, 6);

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

        {/* Uniform grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((album) => (
            <PortfolioCard key={album.id} album={album} />
          ))}
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


