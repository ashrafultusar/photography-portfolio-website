import React from 'react';
import PageHero from '@/components/main/shared/PageHero';
import CompanyStory from '@/components/main/about/CompanyStory';
import TeamSection from '@/components/main/about/TeamSection';
import StatsSection from '@/components/main/about/StatsSection';
import WhyChooseUs from '@/components/main/about/WhyChooseUs';
import { getAboutPageData } from '@/lib/data/aboutData';


export const revalidate = 3600;

export const metadata = {
    title: 'About Us | The Story Photography',
    description: 'Learn about The Story — a Dhaka-based wedding photography studio dedicated to capturing your love story with cinematic elegance.',
};

export default async function AboutPage() {
    const data = await getAboutPageData();

    return (
        <>
            <PageHero
                eyebrow={data.heroSection.eyebrow}
                heading={data.heroSection.heading}
                subtext={data.heroSection.subtext}
                bgImage={data.heroSection.bgImage}
            />
            <CompanyStory data={data.companyStory} />
            <TeamSection data={data.teamSection} />
            <StatsSection data={data.statsSection} />
            <WhyChooseUs data={data.whyChooseUs} />
        </>
    );
}