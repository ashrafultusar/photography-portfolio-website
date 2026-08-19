import React from 'react';
import Portfolio from './Portfolio';
import { getPortfolioAlbumsSummaryData } from '@/lib/data/portfolioData';

export default async function PortfolioSection() {
    const albums = await getPortfolioAlbumsSummaryData();
    return <Portfolio albums={albums} />;
}
