import React from 'react';
import { Zap, Wind, Clapperboard, Camera, Star, Heart } from 'lucide-react';
import { AddOnsSectionData } from '@/lib/types/packages';

const ICON_MAP: Record<string, React.ElementType> = {
    zap: Zap,
    wind: Wind,
    clapperboard: Clapperboard,
    camera: Camera,
    star: Star,
    heart: Heart,
};

interface AddOnsSectionProps {
    data: AddOnsSectionData;
}

const AddOnsSection = ({ data }: AddOnsSectionProps) => {
    return (
        <section className="w-full bg-[#f8fafc] py-24 px-6 md:px-12 text-slate-800 border-t border-slate-300">
            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-14 space-y-3">
                    <p className="text-xs tracking-[0.3em] uppercase text-amber-600 font-sans font-bold">
                        {data.sectionEyebrow}
                    </p>
                    <h2 className="text-4xl md:text-5xl font-serif font-medium text-slate-900">
                        {data.sectionHeading}
                    </h2>
                    <p className="text-slate-700 font-sans text-base max-w-lg mx-auto font-medium">
                        {data.sectionDesc}
                    </p>
                </div>

                {/* Add-on cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {data.addOns.map(({ icon, title, desc, price }) => {
                        const Icon = ICON_MAP[icon] || Star;
                        return (
                            <div
                                key={title}
                                className="group relative border border-slate-300 bg-white hover:border-amber-500 rounded-2xl p-7 space-y-4 transition-all duration-300 text-center shadow-sm"
                            >
                                {/* Icon */}
                                <span className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-amber-500/40 bg-amber-400/20 text-amber-700 mx-auto group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all duration-300">
                                    <Icon size={22} />
                                </span>

                                {/* Info */}
                                <div>
                                    <h3 className="text-slate-900 font-serif text-lg font-bold mb-1">{title}</h3>
                                    <p className="text-slate-600 font-sans text-xs leading-relaxed font-medium">{desc}</p>
                                </div>

                                {/* Price */}
                                <div className="pt-2 border-t border-slate-200">
                                    <p className="text-2xl font-bold text-amber-700">{price}</p>
                                    <p className="text-xs text-slate-500 font-sans mt-0.5 font-medium">per add-on</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* CTA note */}
                <p className="text-center text-slate-600 font-sans text-sm mt-10 font-medium">
                    {data.ctaNote}
                </p>
            </div>
        </section>
    );
};

export default AddOnsSection;
