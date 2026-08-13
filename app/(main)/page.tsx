import React from 'react';
import Hero from '@/components/main/home/Hero';
import About from '@/components/main/home/About';
import Portfolio from '@/components/main/home/Portfolio';
import PackageCards from '@/components/main/package/PackageCards';
import QuoteCTA from '@/components/main/home/QuoteCTA';

export default function HomePage() {
    return (
        <>
            <section id="home">
                <Hero />
            </section>
            <About />
            <Portfolio />
            <QuoteCTA />
            <PackageCards />
        </>
    );
}