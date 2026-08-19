import React, { Suspense } from 'react';
import HeroSection from '@/components/main/home/HeroSection';
import PortfolioSection from '@/components/main/home/PortfolioSection';
import AboutSection from '@/components/main/home/AboutSection';
import TeamSectionComponent from '@/components/main/home/TeamSectionComponent';
import QuoteCTA from '@/components/main/home/QuoteCTA';
import PackageCardsSection from '@/components/main/package/PackageCardsSection';

export const revalidate = 3600;

export default function HomePage() {
    return (
        <div className="flex flex-col">
            <HeroSection />
            <PortfolioSection />
            <AboutSection />
            <TeamSectionComponent />
            <QuoteCTA />
            <Suspense fallback={<div className="h-80 w-full bg-slate-100/50 animate-pulse" />}>
                <PackageCardsSection />
            </Suspense>
        </div>
    );
}
