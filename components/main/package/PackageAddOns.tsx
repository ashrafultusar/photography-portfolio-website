import React from 'react';
import Link from 'next/link';
import { Zap, Wind, Clapperboard, Camera, Star, Heart } from 'lucide-react';
import { AddOnsSectionData } from '@/lib/types/packages';

interface PackageAddOnsProps {
    data: AddOnsSectionData;
}

const ICON_MAP: Record<string, React.ReactNode> = {
    zap: <Zap size={20} />,
    wind: <Wind size={20} />,
    clapperboard: <Clapperboard size={20} />,
    camera: <Camera size={20} />,
    star: <Star size={20} />,
    heart: <Heart size={20} />,
};

const PackageAddOns = ({ data }: PackageAddOnsProps) => {
    return (
        <section className="relative w-full bg-[#e2e8f0] py-28 px-6 md:px-12 overflow-hidden text-slate-800 border-t border-slate-300">

            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative max-w-6xl mx-auto">

                {/* Section Header */}
                <div className="text-center mb-16 space-y-4">
                    <p className="text-xs tracking-[0.4em] uppercase text-amber-600 font-sans font-bold">
                        {data.sectionEyebrow}
                    </p>
                    <h2 className="text-4xl md:text-5xl font-serif font-medium text-slate-900">
                        {data.sectionHeading}
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

                {/* Add-On Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {data.addOns.map((addon) => (
                        <div
                            key={addon.title}
                            className="group relative rounded-2xl bg-slate-100/90 border border-slate-300 p-7 flex flex-col gap-4 hover:border-amber-500/60 hover:bg-white transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            {/* Icon */}
                            <div className="w-11 h-11 rounded-xl bg-amber-400/20 border border-amber-500/30 flex items-center justify-center text-amber-600 group-hover:bg-amber-400/30 transition-colors duration-300">
                                {ICON_MAP[addon.icon] ?? <Star size={20} />}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h3 className="font-serif text-lg text-slate-900 font-bold mb-1 group-hover:text-amber-700 transition-colors">
                                    {addon.title}
                                </h3>
                                <p className="text-slate-600 text-xs font-sans font-medium leading-relaxed">
                                    {addon.desc}
                                </p>
                            </div>

                            {/* Price */}
                            <div className="pt-4 border-t border-slate-200">
                                <span className="text-amber-700 font-bold font-sans text-lg">
                                    {addon.price}
                                </span>
                            </div>

                            {/* Subtle hover glow */}
                            <div className="absolute inset-0 rounded-2xl bg-amber-400/0 group-hover:bg-amber-400/[0.03] transition-all duration-300 pointer-events-none" />
                        </div>
                    ))}
                </div>

                {/* CTA Note */}
                <div className="mt-14 text-center">
                    <div className="inline-block bg-white/80 border border-slate-300 rounded-2xl px-8 py-6 max-w-2xl mx-auto shadow-sm">
                        <p className="text-slate-700 text-sm font-sans font-medium leading-relaxed mb-4">
                            {data.ctaNote}
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-sans font-bold text-xs tracking-widest uppercase px-8 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-amber-400/20"
                        >
                            Book & Customize
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PackageAddOns;
