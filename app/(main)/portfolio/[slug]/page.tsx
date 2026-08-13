import React from 'react';
import { notFound } from 'next/navigation';
import { getAlbumBySlug, portfolioAlbums } from '@/data/portfolioData';
import PortfolioDetail from '@/components/main/portfolio/PortfolioDetail';

// Pre-generate all album routes at build time
export function generateStaticParams() {
    return portfolioAlbums.map((album) => ({ slug: album.slug }));
}

// Dynamic metadata per album
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const album = getAlbumBySlug(slug);
    if (!album) return { title: 'Not Found' };
    return {
        title: `${album.title} | Portfolio | The Story Photography`,
        description: album.description,
    };
}

export default async function AlbumPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const album = getAlbumBySlug(slug);
    if (!album) notFound();

    return <PortfolioDetail album={album} />;
}
