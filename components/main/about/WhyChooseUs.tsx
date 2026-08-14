import React from 'react';
import { Camera, Film, Heart, Award, Clock, MapPin, Star, Users } from 'lucide-react';
import { WhyChooseUsData } from '@/lib/types/about';

const ICON_MAP: Record<string, React.ElementType> = {
    camera: Camera,
    film: Film,
    heart: Heart,
    award: Award,
    clock: Clock,
    'map-pin': MapPin,
    star: Star,
    users: Users,
};

interface WhyChooseUsProps {
    data: WhyChooseUsData;
}

const WhyChooseUs = ({ data }: WhyChooseUsProps) => {
    return (
        <section className="w-full bg-[#f8fafc] py-24 px-6 md:px-12 text-slate-800">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-14 space-y-3">
                    <p className="text-xs tracking-[0.3em] uppercase text-amber-600 font-sans font-bold">
                        {data.eyebrow}
                    </p>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">
                        {data.heading}
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.items.map(({ icon, title, desc }) => {
                        const Icon = ICON_MAP[icon] || Star;
                        return (
                            <div
                                key={title}
                                className="group p-8 border border-slate-300 bg-white hover:border-amber-500 hover:shadow-md rounded-xl transition-all duration-300 space-y-4 shadow-sm"
                            >
                                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-amber-500/40 bg-amber-400/20 text-amber-700 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all duration-300">
                                    <Icon size={20} />
                                </span>
                                <h3 className="text-slate-900 font-serif text-xl font-bold">{title}</h3>
                                <p className="text-slate-600 font-sans text-sm leading-relaxed font-medium">{desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
