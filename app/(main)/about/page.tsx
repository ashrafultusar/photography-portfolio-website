import React from 'react';
import PageHero from '@/components/main/shared/PageHero';
import CompanyStory from '@/components/main/about/CompanyStory';
import TeamSection from '@/components/main/about/TeamSection';
import StatsSection from '@/components/main/about/StatsSection';
import WhyChooseUs from '@/components/main/about/WhyChooseUs';

export const metadata = {
    title: 'About Us | The Story Photography',
    description: 'Learn about The Story — a Dhaka-based wedding photography studio dedicated to capturing your love story with cinematic elegance.',
};

export default function AboutPage() {
    return (
        <>
            <PageHero
                eyebrow="Our Story"
                heading="About The Story"
                subtext="A Dhaka-based wedding photography studio crafting timeless memories since 2018."
                bgImage="/hero/3.jpg"
            />
            <CompanyStory />
            <TeamSection />
            <StatsSection />
            <WhyChooseUs />
        </>
    );
}