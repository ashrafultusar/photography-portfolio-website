import React from 'react';

const portfolioImages = [
    { id: 'photo-1606800052052-a08af7148866', alt: 'Wedding couple walking in outdoor nature setting' },
    { id: 'photo-1583939003579-730e3918a454', alt: 'Happy bride and groom smiling during wedding ceremony' },
    { id: 'photo-1465495976277-4387d4b0a426', alt: 'Beautiful wedding photography and details' },
    { id: 'photo-1520854221256-17451cc331bf', alt: 'Romantic wedding portrait' },
    { id: 'photo-1511285560929-80b456fea0bc', alt: 'Wedding reception celebration' },
    { id: 'photo-1494955870022-74cd68c1e84b', alt: 'Wedding venue decoration' },
];

const Portfolio = () => {
    return (
        <section
            id="portfolio"
            className="w-full bg-neutral-900 py-24 px-6 md:px-12"
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14 space-y-3">
                    <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-sans">
                        Our Work
                    </p>
                    <h2 className="text-4xl md:text-5xl font-serif font-light text-white">
                        Portfolio
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {portfolioImages.map(({ id, alt }) => (
                        <div
                            key={id}
                            className="relative aspect-square overflow-hidden group"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`https://images.unsplash.com/${id}?q=75&w=600&auto=format&fit=crop`}
                                alt={alt}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Portfolio;
