import React from 'react';
import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';

const packages = [
    {
        name: 'Silver',
        tagline: 'Perfect for intimate moments',
        price: '৳ 25,000',
        unit: 'per event',
        featured: false,
        features: [
            '6 Hours Coverage',
            '200+ Edited Photos',
            'Online Gallery',
            '1 Photographer',
            'Basic Highlight Reel',
        ],
    },
    {
        name: 'Gold',
        tagline: 'Our most loved package',
        price: '৳ 45,000',
        unit: 'per event',
        featured: true,
        features: [
            'Full Day Coverage',
            '400+ Edited Photos',
            'Cinematic Highlight Video',
            '2 Photographers',
            'Luxury Printed Album',
            'Online Gallery (1 Year)',
        ],
    },
    {
        name: 'Platinum',
        tagline: 'The complete experience',
        price: '৳ 75,000',
        unit: 'per event',
        featured: false,
        features: [
            '2-Day Full Coverage',
            '600+ Edited Photos',
            'Full Wedding Film',
            '3 Photographers',
            'Luxury Heirloom Album',
            'Drone Aerial Shots',
            'Same-Day Preview',
        ],
    },
];

const PackageCards = () => {
    return (
        <section className="relative w-full bg-neutral-950 py-28 px-6 md:px-12 overflow-hidden">

            {/* Subtle background gradient blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative max-w-6xl mx-auto">

                {/* Section Header */}
                <div className="text-center mb-16 space-y-4">
                    <p className="text-xs tracking-[0.4em] uppercase text-red-600 font-sans">
                        Investment
                    </p>
                    <h2 className="text-4xl md:text-5xl font-serif font-light text-white">
                        Choose Your <em className="not-italic text-red-500">Story</em>
                    </h2>
                    <p className="text-gray-500 font-sans text-sm max-w-md mx-auto">
                        Every package includes full post-processing, private online gallery, and a dedicated story editor.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-px w-16 bg-red-700/40" />
                        <div className="w-1.5 h-1.5 rounded-full bg-red-700" />
                        <div className="h-px w-16 bg-red-700/40" />
                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    {packages.map((pkg) => (
                        <div
                            key={pkg.name}
                            className={`relative rounded-sm transition-all duration-300 ${pkg.featured
                                ? 'bg-gradient-to-b from-red-950/60 to-neutral-900/80 border border-red-700/40 shadow-2xl shadow-red-950/30 md:-mt-6 md:pb-2'
                                : 'bg-white/[0.03] border border-white/8 hover:border-white/15'
                                }`}
                        >
                            {/* Popular badge */}
                            {pkg.featured && (
                                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                                    <span className="flex items-center gap-1.5 bg-red-700 text-white text-[10px] tracking-widest uppercase font-sans px-5 py-1.5 rounded-full shadow-lg">
                                        <Sparkles size={10} />
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="p-8 space-y-6">
                                {/* Package name + tagline */}
                                <div className="border-b border-white/8 pb-5">
                                    <h3 className="text-2xl font-serif text-white mb-1">{pkg.name}</h3>
                                    <p className="text-gray-500 text-xs font-sans">{pkg.tagline}</p>
                                </div>

                                {/* Price */}
                                <div className="space-y-0.5">
                                    <p className={`text-4xl font-light ${pkg.featured ? 'text-red-400' : 'text-white'}`}>
                                        {pkg.price}
                                    </p>
                                    <p className="text-gray-600 text-xs font-sans uppercase tracking-wider">{pkg.unit}</p>
                                </div>

                                {/* Features list */}
                                <ul className="space-y-3">
                                    {pkg.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3 text-sm font-sans text-gray-400">
                                            <span className={`flex items-center justify-center w-4 h-4 rounded-full border shrink-0 ${pkg.featured ? 'border-red-700/50 text-red-500' : 'border-white/20 text-gray-500'}`}>
                                                <Check size={9} />
                                            </span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA button */}
                                <Link
                                    href="/contact"
                                    className={`block text-center py-3.5 text-xs tracking-widest uppercase font-sans transition-all duration-300 ${pkg.featured
                                        ? 'bg-red-700 hover:bg-red-600 text-white'
                                        : 'border border-white/20 text-white hover:bg-white hover:text-black'
                                        }`}
                                >
                                    Book This Package
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom nudge */}
                <p className="text-center text-gray-600 text-xs font-sans mt-10">
                    Need something custom?{' '}
                    <Link href="/contact" className="text-red-500 hover:text-red-400 underline underline-offset-4 transition-colors">
                        Let&apos;s talk.
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default PackageCards;
