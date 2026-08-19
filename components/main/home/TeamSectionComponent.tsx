import React from 'react';
import TeamSection from '@/components/main/about/TeamSection';
import { getAboutPageData } from '@/lib/data/aboutData';

export default async function TeamSectionComponent() {
    const aboutData = await getAboutPageData();
    if (!aboutData.teamSection) return null;
    return <TeamSection data={aboutData.teamSection} />;
}
