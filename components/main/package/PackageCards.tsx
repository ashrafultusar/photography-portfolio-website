"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { PricingSectionData, PackageItem } from '@/lib/types/packages';

interface PackageCardsProps {
    data: PricingSectionData;
}

const FEATURE_LIMIT = 5;

const PackageCardItem = ({ pkg }: { pkg: PackageItem }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasMoreFeatures = pkg.features.length > FEATURE_LIMIT;
    const visibleFeatures = isExpanded ? pkg.features : pkg.features.slice(0, FEATURE_LIMIT);

    return (
        <div
            className={`relative rounded-2xl transition-all duration-300 flex flex-col justify-between h-full ${pkg.featured
                ? 'bg-white border-2 border-amber-500 shadow-xl md:-mt-6'
                : 'bg-slate-100/90 border border-slate-300 hover:border-amber-500/60 shadow-md'
                }`}
        >
            {/* Popular badge */}
            {pkg.featured && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="flex items-center gap-1.5 bg-amber-400 text-slate-950 text-[10px] tracking-widest uppercase font-sans font-bold px-5 py-1.5 rounded-full shadow-md">
                        <Sparkles size={11} />
                        Most Popular
                    </span>
                </div>
            )}

            <div className="p-8 flex flex-col justify-between flex-1 space-y-6">
                <div className="space-y-6">
                    {/* Package name + tagline */}
                    <div className="border-b border-slate-200 pb-5">
                        <h3 className="text-2xl font-serif text-slate-900 font-bold mb-1">{pkg.name}</h3>
                        <p className="text-slate-600 text-xs font-sans font-medium">{pkg.tagline}</p>
                    </div>

                    {/* Price */}
                    <div className="space-y-0.5">
                        <p className={`text-4xl font-bold ${pkg.featured ? 'text-amber-700' : 'text-slate-900'}`}>
                            {pkg.price}
                        </p>
                        <p className="text-slate-500 text-xs font-sans uppercase tracking-wider font-semibold">{pkg.unit}</p>
                    </div>

                    {/* Features list */}
                    <div className="space-y-3">
                        <ul className="space-y-3">
                            {visibleFeatures.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-sm font-sans text-slate-800 font-medium">
                                    <span className={`flex items-center justify-center w-4 h-4 rounded-full border shrink-0 ${pkg.featured ? 'border-amber-500 text-amber-700 bg-amber-400/20' : 'border-slate-400 text-slate-600 bg-slate-200'}`}>
                                        <Check size={9} />
                                    </span>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        {hasMoreFeatures && (
                            <button
                                type="button"
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-amber-600 hover:text-amber-700 transition-colors pt-1"
                            >
                                {isExpanded ? (
                                    <>
                                        See Less <ChevronUp size={14} />
                                    </>
                                ) : (
                                    <>
                                        See More ({pkg.features.length - FEATURE_LIMIT} more) <ChevronDown size={14} />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* CTA button */}
                <div className="pt-2">
                    <Link
                        href="/contact"
                        className={`block text-center py-3.5 rounded-xl text-xs tracking-widest uppercase font-sans font-bold transition-all duration-300 ${pkg.featured
                            ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-md'
                            : 'bg-slate-200 border border-slate-300 text-slate-900 hover:bg-amber-400 hover:text-slate-950 hover:border-amber-400'
                            }`}
                    >
                        Book This Package
                    </Link>
                </div>
            </div>
        </div>
    );
};

const PackageCards = ({ data }: PackageCardsProps) => {
    return (
        <section className="relative w-full bg-[#e2e8f0] py-28 px-6 md:px-12 overflow-hidden text-slate-800 border-t border-b border-slate-300">

            {/* Subtle background gradient blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-400/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative max-w-6xl mx-auto">

                {/* Section Header */}
                <div className="text-center mb-16 space-y-4">
                    <p className="text-xs tracking-[0.4em] uppercase text-amber-600 font-sans font-bold">
                        {data.sectionEyebrow}
                    </p>
                    <h2 className="text-4xl md:text-5xl font-serif font-medium text-slate-900">
                        {data.sectionHeading}{' '}
                        <em className="not-italic text-amber-600 font-serif font-bold">{data.sectionHeadingAccent}</em>
                    </h2>
                    <p className="text-slate-700 font-sans text-sm max-w-md mx-auto font-medium">
                        {data.sectionDesc}
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-px w-16 bg-amber-500/40" />
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <div className="h-px w-16 bg-amber-500/40" />
                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {data.packages.map((pkg) => (
                        <PackageCardItem key={pkg.name} pkg={pkg} />
                    ))}
                </div>

                {/* Bottom nudge */}
                <p className="text-center text-slate-600 text-xs font-sans mt-10 font-medium">
                    {data.noteText.includes("Let's talk") || data.noteText.includes("Let") ? (
                        <>
                            {data.noteText.split(/Let['']s talk/)[0]}
                            <Link href="/contact" className="text-amber-700 hover:text-amber-800 underline underline-offset-4 transition-colors font-bold">
                                Let&apos;s talk.
                            </Link>
                        </>
                    ) : (
                        data.noteText
                    )}
                </p>
            </div>
        </section>
    );
};

export default PackageCards;
