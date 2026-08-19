import React from 'react';
import Hero from './Hero';
import { getHeroData } from '@/lib/data/heroData';

export default async function HeroSection() {
    const data = await getHeroData();
    return (
        <section id="home">
            <Hero data={data} />
        </section>
    );
}
