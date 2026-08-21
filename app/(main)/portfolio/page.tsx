import React from 'react';
import PageHero from '@/components/main/shared/PageHero';
import PortfolioGallery from '@/components/main/portfolio/PortfolioGallery';
import { getPortfolioAlbumsSummaryData } from '@/lib/data/portfolioData';
import { getCategoryNames } from '@/lib/data/categoryData';

export const dynamic = 'force-static';
export const revalidate = 3600;

export const metadata = {
    title: 'Portfolio | The Story Photography',
    description: 'Browse our wedding, engagement, pre-wedding, and event photography portfolio.',
};

export default async function PortfolioPage() {
    const [albums, catNames] = await Promise.all([
        getPortfolioAlbumsSummaryData(),
        getCategoryNames(),
    ]);

    const categories = ["All", ...catNames];

    return (
        <>
            <PageHero
                eyebrow="Our Work"
                heading="Portfolio"
                subtext="Every frame tells a story. Browse our collection of cherished moments."
                bgImage="/hero/1.jpg"
            />
            <PortfolioGallery albums={albums} categories={categories} />
        </>
    );
}
