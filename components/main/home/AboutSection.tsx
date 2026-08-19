import React from 'react';
import About from './About';
import { getAboutPageData } from '@/lib/data/aboutData';

export default async function AboutSection() {
    const aboutData = await getAboutPageData();
    return <About data={aboutData.homeSection} />;
}
