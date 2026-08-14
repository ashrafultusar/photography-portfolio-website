import React from 'react';
import { notFound } from 'next/navigation';
import { getAlbumBySlugData, getPortfolioAlbumsSummaryData } from '@/lib/data/portfolioData';
import PortfolioDetail from '@/components/main/portfolio/PortfolioDetail';

// Pre-generate routes dynamically from DB summary data
export async function generateStaticParams() {
    const albums = await getPortfolioAlbumsSummaryData();
    return albums.map((album) => ({ slug: album.slug }));
}

// Dynamic metadata per album
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const album = await getAlbumBySlugData(slug);
    if (!album) return { title: 'Not Found' };
    return {
        title: `${album.title} | Portfolio | The Story Photography`,
        description: album.description,
    };
}

export default async function AlbumPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const album = await getAlbumBySlugData(slug);
    if (!album) notFound();

    return <PortfolioDetail album={album} />;
}
