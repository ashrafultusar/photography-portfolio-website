"use client";

import React, { useState } from "react";
import { PortfolioAlbumData } from "@/lib/types/portfolio";
import { portfolioAlbums as defaultStaticAlbums } from "@/data/portfolioData";
import { PortfolioCard } from "./PortfolioCard";

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
            <PortfolioCard key={album.id} album={album} />
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
