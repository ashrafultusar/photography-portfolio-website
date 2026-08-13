import React from 'react';

const story = [
    {
        label: 'Our Beginning',
        text: 'The Story was born from a simple belief — that every love story deserves to be told beautifully. Founded in Dhaka, we started as a two-person team with a single camera and an unmatched passion for authentic moments.',
    },
    {
        label: 'Our Vision',
        text: 'We envision a world where every couple can look back at their wedding day and feel every emotion again — the nervous laughs, the happy tears, the quiet glances. We freeze those fleeting seconds forever.',
    },
    {
        label: 'Our Mission',
        text: 'To deliver cinematic, emotionally resonant photography and videography that tells your unique story — with artistry, integrity, and heart.',
    },
];

const CompanyStory = () => {
    return (
        <section className="w-full bg-neutral-950 py-24 px-6 md:px-12">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Image */}
                <div className="relative">
                    <div className="absolute -top-4 -left-4 w-full h-full border border-red-800/30 rounded-sm pointer-events-none" />
                    <img
                        src="/hero/2.jpg"
                        alt="The Story team at work"
                        className="w-full h-80 lg:h-[480px] object-cover rounded-sm"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent rounded-b-sm" />
                </div>

                {/* Content */}
                <div className="space-y-10">
                    <div>
                        <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-sans mb-3">
                            Who We Are
                        </p>
                        <h2 className="text-4xl md:text-5xl font-serif font-light text-white leading-snug">
                            A Studio Built on<br />Love & Light
                        </h2>
                    </div>

                    <div className="space-y-8">
                        {story.map((item) => (
                            <div key={item.label} className="border-l-2 border-red-700/50 pl-5">
                                <h3 className="text-sm tracking-widest uppercase text-red-500 font-sans mb-2">
                                    {item.label}
                                </h3>
                                <p className="text-gray-400 font-sans text-base leading-relaxed">
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CompanyStory;
