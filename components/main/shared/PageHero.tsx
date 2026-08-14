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
                <div className="absolute inset-0 bg-[#e2e8f0]" />
            )}

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-slate-950/50" aria-hidden="true" />

            {/* Decorative top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

            {/* Content */}
            <div className="relative z-10 px-6">
                <p className="text-xs tracking-[0.35em] uppercase text-amber-400 font-sans font-bold mb-3">
                    {eyebrow}
                </p>
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-amber-400 leading-tight">
                    {heading}
                </h1>
                {subtext && (
                    <p className="mt-4 text-slate-100 font-sans text-base max-w-xl mx-auto font-medium">
                        {subtext}
                    </p>
                )}
                <div className="w-16 h-1 bg-amber-400 mx-auto mt-6 rounded-full" />
            </div>
        </section>
    );
};

export default PageHero;
