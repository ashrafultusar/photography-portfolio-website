import React from 'react';
import { Zap, Wind, Clapperboard, Camera } from 'lucide-react';

const addOns = [
    {
        icon: Zap,
        title: 'Express Delivery',
        desc: 'Delivery within 7 days',
        price: '৳10,000',
    },
    {
        icon: Wind,
        title: 'Drone Coverage',
        desc: 'Aerial shots, 5 hours',
        price: '৳25,000',
    },
    {
        icon: Clapperboard,
        title: '4K Quality',
        desc: 'Upgraded 4K footage',
        price: '৳25,000',
    },
    {
        icon: Camera,
        title: 'Pre-Shoot',
        desc: '1 Photographer + 1 Videographer, 1 Hour',
        price: '৳20,000',
    },
];

const AddOnsSection = () => {
    return (
        <section className="w-full bg-neutral-900 py-24 px-6 md:px-12">
            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-14 space-y-3">
                    <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-sans">
                        Customize
                    </p>
                    <h2 className="text-4xl md:text-5xl font-serif font-light text-white">
                        Enhance Your Experience
                    </h2>
                    <p className="text-gray-400 font-sans text-base max-w-lg mx-auto">
                        Add-Ons — Customize your package with these premium additions.
                    </p>
                </div>

                {/* Add-on cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {addOns.map(({ icon: Icon, title, desc, price }) => (
                        <div
                            key={title}
                            className="group relative border border-white/10 bg-white/5 hover:border-red-700/40 hover:bg-red-900/10 rounded-sm p-7 space-y-4 transition-all duration-300 text-center"
                        >
                            {/* Icon */}
                            <span className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-red-700/40 bg-red-900/20 text-red-500 mx-auto group-hover:scale-110 transition-transform duration-300">
                                <Icon size={22} />
                            </span>

                            {/* Info */}
                            <div>
                                <h3 className="text-white font-serif text-lg mb-1">{title}</h3>
                                <p className="text-gray-500 font-sans text-xs leading-relaxed">{desc}</p>
                            </div>

                            {/* Price */}
                            <div className="pt-2 border-t border-white/10">
                                <p className="text-2xl font-light text-white">{price}</p>
                                <p className="text-xs text-gray-500 font-sans mt-0.5">per add-on</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA note */}
                <p className="text-center text-gray-500 font-sans text-sm mt-10">
                    Mention your desired add-ons when booking and we&apos;ll tailor the perfect package for you.
                </p>
            </div>
        </section>
    );
};

export default AddOnsSection;
