import React from 'react';
import PageHero from '@/components/main/shared/PageHero';
import PackageCards from '@/components/main/package/PackageCards';
import AddOnsSection from '@/components/main/package/AddOnsSection';

export const metadata = {
    title: 'Packages | The Story Photography',
    description: 'Explore our photography & videography packages. Silver, Gold, and Platinum tiers plus premium add-ons.',
};

export default function PackagesPage() {
    return (
        <>
            <PageHero
                eyebrow="Pricing"
                heading="Our Packages"
                subtext="Transparent pricing crafted to suit every couple's dream day."
                bgImage="/hero/4.jpg"
            />
            <PackageCards />
            <AddOnsSection />
        </>
    );
}
