'use client';

import React, { useState } from 'react';

const categories = ['All', 'Wedding', 'Engagement', 'Pre-Wedding', 'Events', 'Portrait'];

const allImages = [
    { id: 1, src: '/hero/1.jpg', alt: 'Wedding couple walking outdoors', category: 'Wedding' },
    { id: 2, src: '/hero/2.jpg', alt: 'Bride and groom smiling', category: 'Wedding' },
    { id: 3, src: '/hero/3.jpg', alt: 'Wedding details and decorations', category: 'Events' },
    { id: 4, src: '/hero/4.jpg', alt: 'Couple in nature', category: 'Pre-Wedding' },
    { id: 5, src: '/hero/1.jpg', alt: 'Engagement ring ceremony', category: 'Engagement' },
    { id: 6, src: '/hero/2.jpg', alt: 'Portrait session outdoors', category: 'Portrait' },
    { id: 7, src: '/hero/3.jpg', alt: 'Reception celebration', category: 'Events' },
    { id: 8, src: '/hero/4.jpg', alt: 'Pre-wedding Sundarbans shoot', category: 'Pre-Wedding' },
    { id: 9, src: '/hero/1.jpg', alt: 'Couple portrait golden hour', category: 'Portrait' },
    { id: 10, src: '/hero/2.jpg', alt: 'Wedding ceremony vows', category: 'Wedding' },
    { id: 11, src: '/hero/3.jpg', alt: 'Engagement session garden', category: 'Engagement' },
    { id: 12, src: '/hero/4.jpg', alt: 'Reception dance floor', category: 'Events' },
];

const PortfolioGallery = () => {
    const [active, setActive] = useState('All');

    const filtered = active === 'All' ? allImages : allImages.filter((img) => img.category === active);

    return (
        <section className="w-full bg-neutral-950 py-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActive(cat)}
                            className={`px-5 py-2 text-xs tracking-widest uppercase font-sans border transition-all duration-300 rounded-sm ${active === cat
                                    ? 'bg-red-700 border-red-700 text-white'
                                    : 'border-white/20 text-gray-400 hover:border-white/50 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map(({ id, src, alt, category }) => (
                        <div
                            key={id}
                            className="relative aspect-square overflow-hidden group rounded-sm border border-white/5"
                        >
                            <img
                                src={src}
                                alt={alt}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 flex items-end p-4">
                                <p className="text-white text-xs tracking-widest uppercase font-sans translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    {category}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <p className="text-center text-gray-500 font-sans mt-16">No images in this category yet.</p>
                )}
            </div>
        </section>
    );
};

export default PortfolioGallery;
