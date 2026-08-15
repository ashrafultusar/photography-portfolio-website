import React from 'react';
import Hero from '@/components/main/home/Hero';
import About from '@/components/main/home/About';
import Portfolio from '@/components/main/home/Portfolio';
import PackageCards from '@/components/main/package/PackageCards';
import QuoteCTA from '@/components/main/home/QuoteCTA';
import { getHeroData } from '@/lib/data/heroData';
import { getPortfolioAlbumsSummaryData } from '@/lib/data/portfolioData';
import { getPackagesPageData } from '@/lib/data/packagesData';
import { getAboutPageData } from '@/lib/data/aboutData';


export default async function HomePage() {
    const [heroData, portfolioAlbums, packagesData, aboutData] = await Promise.all([
        getHeroData(),
        getPortfolioAlbumsSummaryData(),
        getPackagesPageData(),
        getAboutPageData(),
    ]);

    return (
        <>
            <section id="home">
                <Hero data={heroData} />
            </section>
            <About data={aboutData.homeSection} />
            <Portfolio albums={portfolioAlbums} />
            <QuoteCTA />
            <PackageCards data={packagesData.pricingSection} />
        </>
    );
}
