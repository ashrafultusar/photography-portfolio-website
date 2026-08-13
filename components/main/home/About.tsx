import React from 'react';

const About = () => {
    return (
        <section
            id="about"
            className="w-full bg-neutral-950 py-24 px-6 md:px-12 text-center"
        >
            <div className="max-w-3xl mx-auto space-y-6">
                <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-sans">
                    Our Story
                </p>
                <h2 className="text-4xl md:text-5xl font-serif font-light text-white leading-snug">
                    We Capture Moments,<br />You Relive Them Forever
                </h2>
                <p className="text-gray-400 font-sans text-base leading-relaxed">
                    The Story is a Dhaka-based wedding photography studio
                    dedicated to telling your love story with authenticity and
                    cinematic beauty. Every frame we capture is a memory you
                    will treasure for a lifetime.
                </p>
            </div>
        </section>
    );
};

export default About;
