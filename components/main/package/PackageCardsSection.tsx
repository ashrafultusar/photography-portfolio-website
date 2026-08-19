import React from 'react';
import PackageCards from './PackageCards';
import { getPackagesPageData } from '@/lib/data/packagesData';

export default async function PackageCardsSection() {
    const packagesData = await getPackagesPageData();
    return <PackageCards data={packagesData.pricingSection} />;
}
