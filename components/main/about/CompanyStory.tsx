import React from 'react';
import { CompanyStoryData } from '@/lib/types/about';

interface CompanyStoryProps {
    data: CompanyStoryData;
}

const CompanyStory = ({ data }: CompanyStoryProps) => {
    return (
        <section className="w-full bg-[#e2e8f0] py-24 px-6 md:px-12 text-slate-800 border-t border-slate-300">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Image */}
                <div className="relative">
                    <div className="absolute -top-4 -left-4 w-full h-full border-2 border-amber-500/50 rounded-sm pointer-events-none" />
                    <img
                        src={data.image}
                        alt="The Story team at work"
                        className="w-full h-80 lg:h-[480px] object-cover rounded-sm shadow-md"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-slate-950/60 to-transparent rounded-b-sm" />
                </div>

                {/* Content */}
                <div className="space-y-10">
                    <div>
                        <p className="text-xs tracking-[0.3em] uppercase text-amber-600 font-sans font-bold mb-3">
                            {data.eyebrow}
                        </p>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-snug whitespace-pre-line">
                            {data.heading}
                        </h2>
                    </div>

                    <div className="space-y-8">
                        {data.items.map((item) => (
                            <div key={item.label} className="border-l-4 border-amber-500 pl-5">
                                <h3 className="text-sm tracking-widest uppercase text-amber-700 font-sans font-bold mb-2">
                                    {item.label}
                                </h3>
                                <p className="text-slate-700 font-sans text-base leading-relaxed font-medium">
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
