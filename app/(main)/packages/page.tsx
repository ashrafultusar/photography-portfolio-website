import React from 'react';
import PackagePage from '@/components/main/package/PackagePage';
import { getPackagesPageData } from '@/lib/data/packagesData';

export const revalidate = 3600;

export const metadata = {
    title: 'Packages & Pricing | The Story Photography',
    description: 'Explore transparent wedding photography packages — Silver, Gold, and Platinum — crafted for every couple\'s dream day in Dhaka, Bangladesh.',
};

export default async function PackagesRoute() {
    const data = await getPackagesPageData();

    return <PackagePage data={data} />;
}

