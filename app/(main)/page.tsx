import React from 'react';
import Hero from '@/components/main/home/Hero';
import About from '@/components/main/home/About';
import Portfolio from '@/components/main/home/Portfolio';
import Packages from '@/components/main/home/Packages';
import BookUs from '@/components/main/home/BookUs';

export default function HomePage() {
    return (
        <>
            <section id="home">
                <Hero />
            </section>
            <About />
            <Portfolio />
            <Packages />
            <BookUs />
        </>
    );
}