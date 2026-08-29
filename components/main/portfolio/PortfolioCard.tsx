"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PortfolioAlbumData } from "@/lib/types/portfolio";
import { getOptimizedImageUrl } from "@/lib/imageOptimization";

interface PortfolioCardProps {
    album: PortfolioAlbumData;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({ album }) => {
    return (
        <Link
            href={`/portfolio/${album.slug}`}
            className="group relative h-72 md:h-80 overflow-hidden rounded-sm cursor-pointer bg-slate-200 border border-slate-300 shadow-md block"
        >
            {/* Cover image */}
            <Image
                src={getOptimizedImageUrl(album.coverImage, 800)}
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
                <p className="text-white font-serif text-lg md:text-xl font-medium group-hover:text-amber-300 transition-colors">
                    {album.title}
                </p>
                <p className="text-slate-300 text-xs font-sans tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {album.eventDate} · {album.location}
                </p>
            </div>

            {/* Corner accent */}
            <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-amber-400/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
        </Link>
    );
};

export default PortfolioCard;
