import React from 'react';

interface PageHeroProps {
    eyebrow: string;
    heading: string;
    subtext?: string;
    bgImage?: string;
}

const PageHero = ({ eyebrow, heading, subtext, bgImage }: PageHeroProps) => {
    return (
        <section
            className="relative w-full h-72 md:h-96 flex items-center justify-center text-center overflow-hidden"
            aria-label={`${heading} Page Hero`}
        >
            {/* Background */}
            {bgImage ? (
                <img
                    src={bgImage}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
            ) : (
                <div className="absolute inset-0 bg-neutral-950" />
            )}

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

            {/* Decorative top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-700/60 to-transparent" />

            {/* Content */}
            <div className="relative z-10 px-6">
                <p className="text-xs tracking-[0.35em] uppercase text-red-500 font-sans mb-3">
                    {eyebrow}
                </p>
                <h1 className="text-4xl md:text-6xl font-serif font-light text-white leading-tight">
                    {heading}
                </h1>
                {subtext && (
                    <p className="mt-4 text-gray-400 font-sans text-base max-w-xl mx-auto">
                        {subtext}
                    </p>
                )}
                <div className="w-12 h-px bg-red-600 mx-auto mt-6" />
            </div>
        </section>
    );
};

export default PageHero;
