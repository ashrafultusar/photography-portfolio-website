import React, { Suspense } from 'react';
import HeroSection from '@/components/main/home/HeroSection';
import PortfolioSection from '@/components/main/home/PortfolioSection';
import AboutSection from '@/components/main/home/AboutSection';
import TeamSectionComponent from '@/components/main/home/TeamSectionComponent';
import QuoteCTA from '@/components/main/home/QuoteCTA';
import PackageCardsSection from '@/components/main/package/PackageCardsSection';

export const dynamic = 'force-static';
export const revalidate = 3600;

function SectionSkeleton({ height = "h-96" }: { height?: string }) {
    return (
        <div className={`w-full ${height} bg-white animate-pulse border-b border-slate-100 flex flex-col items-center justify-center`}>
            <div className="w-12 h-12 rounded-full border-4 border-amber-100 border-t-amber-500 animate-spin" />
        </div>
    );
}

export default function HomePage() {
    return (
        <div className="flex flex-col bg-neutral-950 text-white">
            <Suspense fallback={<SectionSkeleton height="h-screen" />}>
                <HeroSection />
            </Suspense>

            <Suspense fallback={<SectionSkeleton height="h-[600px]" />}>
                <PortfolioSection />
            </Suspense>

            <Suspense fallback={<SectionSkeleton height="h-[500px]" />}>
                <AboutSection />
            </Suspense>

            <Suspense fallback={<SectionSkeleton height="h-[450px]" />}>
                <TeamSectionComponent />
            </Suspense>

            <QuoteCTA />

            <Suspense fallback={<SectionSkeleton height="h-[650px]" />}>
                <PackageCardsSection />
            </Suspense>
        </div>
    );
}

