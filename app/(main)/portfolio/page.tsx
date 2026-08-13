import React from 'react';
import PageHero from '@/components/main/shared/PageHero';
import PortfolioGallery from '@/components/main/portfolio/PortfolioGallery';

export const metadata = {
    title: 'Portfolio | The Story Photography',
    description: 'Browse our wedding, engagement, pre-wedding, and event photography portfolio.',
};

export default function PortfolioPage() {
    return (
        <>
            <PageHero
                eyebrow="Our Work"
                heading="Portfolio"
                subtext="Every frame tells a story. Browse our collection of cherished moments."
                bgImage="/hero/1.jpg"
            />
            <PortfolioGallery />
        </>
    );
}
