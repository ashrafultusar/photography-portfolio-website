"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PortfolioAlbumData } from "@/lib/types/portfolio";
import { portfolioAlbums as defaultStaticAlbums } from "@/data/portfolioData";
import { getOptimizedImageUrl } from "@/lib/imageOptimization";

interface PortfolioGalleryProps {
  albums?: PortfolioAlbumData[];
  categories?: string[];
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

const INITIAL_VISIBLE_COUNT = 9;
const LOAD_MORE_STEP = 6;

const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({ albums, categories: propCategories }) => {
  const [active, setActive] = useState("All");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const albumList = albums && albums.length > 0 ? albums : defaultAlbumsList;

  const allCategories = propCategories && propCategories.length > 0
    ? propCategories
    : ["All", ...Array.from(new Set(albumList.map((a) => a.category)))];

  const filtered =
    active === "All"
      ? albumList
      : albumList.filter((a) => a.category === active);

  const displayedAlbums = filtered.slice(0, visibleCount);

  const handleCategoryChange = (cat: string) => {
    setActive(cat);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  return (
    <section className="w-full bg-[#e2e8f0] py-20 px-6 md:px-12 text-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-5 py-2.5 text-xs tracking-widest uppercase font-sans border transition-all duration-300 rounded-xl font-medium cursor-pointer ${active === cat
                ? "bg-amber-400 border-amber-500 text-slate-950 font-bold shadow-md"
                : "border-slate-300 text-slate-700 hover:border-amber-500 hover:text-amber-700 bg-white/80"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Album Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedAlbums.map((album) => (
            <Link
              key={album.id}
              href={`/portfolio/${album.slug}`}
              className="group block relative overflow-hidden rounded-2xl border border-slate-300 cursor-pointer bg-white hover:border-amber-500 transition-all duration-300 shadow-md"
            >
              {/* Cover image */}
              <div className="relative h-72 overflow-hidden bg-slate-200">
                <Image
                  src={getOptimizedImageUrl(album.coverImage, 800)}
                  alt={album.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={80}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent z-10" />

                {/* Photo count badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-300 z-10 shadow-sm">
                  <span className="text-[10px] text-slate-900 font-mono font-bold tracking-widest">
                    {album.photoCount || album.images?.length || 0} Photos
                  </span>
                </div>

                {/* Category badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-slate-950 font-bold bg-amber-400 px-3 py-1 rounded-md shadow-sm">
                    {album.category}
                  </span>
                </div>
              </div>

              {/* Info bar */}
              <div className="bg-slate-100/90 px-5 py-4 flex items-center justify-between group-hover:bg-slate-200 transition-colors duration-300 border-t border-slate-200">
                <div>
                  <p className="text-slate-900 font-serif text-lg leading-tight font-bold group-hover:text-amber-700 transition-colors">
                    {album.title}
                  </p>
                  <p className="text-slate-600 text-xs font-sans tracking-widest mt-1 font-medium">
                    {album.eventDate} · {album.location}
                  </p>
                </div>
                <div className="text-slate-800 group-hover:translate-x-1 transition-transform duration-300 p-2 rounded-full bg-slate-200 group-hover:bg-amber-400 group-hover:text-slate-950 shadow-sm">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < filtered.length && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_STEP)}
              className="px-8 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs tracking-widest uppercase rounded-xl transition-all duration-300 shadow-md cursor-pointer hover:shadow-lg"
            >
              Load More Albums ({filtered.length - visibleCount} Remaining)
            </button>
          </div>
        )}

        {filtered.length === 0 && (
          <p className="text-center text-slate-500 font-sans mt-16">
            No albums in this category yet.
          </p>
        )}
      </div>
    </section>
  );
};

export default PortfolioGallery;
