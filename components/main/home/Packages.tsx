import React from 'react';

const packages = [
    {
        name: 'Silver',
        price: '৳ 25,000',
        featured: false,
        features: [
            '6 Hours Coverage',
            '200+ Edited Photos',
            'Online Gallery',
            '1 Photographer',
        ],
    },
    {
        name: 'Gold',
        price: '৳ 45,000',
        featured: true,
        features: [
            'Full Day Coverage',
            '400+ Edited Photos',
            'Cinematic Highlight Video',
            '2 Photographers',
            'Printed Album',
        ],
    },
    {
        name: 'Platinum',
        price: '৳ 75,000',
        featured: false,
        features: [
            '2-Day Coverage',
            '600+ Edited Photos',
            'Full Wedding Film',
            '3 Photographers',
            'Luxury Album',
            'Drone Shots',
        ],
    },
];

const Packages = () => {
    return (
        <section
            id="packages"
            className="w-full bg-neutral-950 py-24 px-6 md:px-12"
        >
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-14 space-y-3">
                    <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-sans">
                        Pricing
                    </p>
                    <h2 className="text-4xl md:text-5xl font-serif font-light text-white">
                        Our Packages
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {packages.map((pkg) => (
                        <div
                            key={pkg.name}
                            className={`rounded-sm border p-8 space-y-6 transition-all duration-300 ${pkg.featured
                                    ? 'bg-red-900/20 border-red-700/50 scale-105'
                                    : 'bg-white/5 border-white/10 hover:border-white/25'
                                }`}
                        >
                            {pkg.featured && (
                                <p className="text-xs tracking-widest uppercase text-red-500 font-sans">
                                    Most Popular
                                </p>
                            )}
                            <h3 className="text-2xl font-serif text-white">{pkg.name}</h3>
                            <p className="text-3xl font-light text-white">{pkg.price}</p>
                            <ul className="space-y-2 text-gray-400 font-sans text-sm">
                                {pkg.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <a
                                href="#book-us"
                                className="block text-center mt-4 border border-white/30 py-2 text-sm tracking-widest uppercase text-white hover:bg-white hover:text-black transition-all duration-300"
                            >
                                Book Now
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Packages;
