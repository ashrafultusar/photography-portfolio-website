import React from 'react';
import PageHero from '@/components/main/shared/PageHero';
import PackageCards from '@/components/main/package/PackageCards';
import PackageAddOns from '@/components/main/package/PackageAddOns';
import { PackagesPageData } from '@/lib/types/packages';

interface PackagePageProps {
    data: PackagesPageData;
}

const PackagePage = ({ data }: PackagePageProps) => {
    return (
        <>
            <PageHero
                eyebrow={data.heroSection.eyebrow}
                heading={data.heroSection.heading}
                subtext={data.heroSection.subtext}
                bgImage={data.heroSection.bgImage}
            />
            <PackageCards data={data.pricingSection} />
            <PackageAddOns data={data.addOnsSection} />
        </>
    );
};

export default PackagePage;