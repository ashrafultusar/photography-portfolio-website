import React from 'react';
import { TeamSectionData } from '@/lib/types/about';

interface TeamSectionProps {
    data: TeamSectionData;
}

const TeamSection = ({ data }: TeamSectionProps) => {
    return (
        <section className="w-full bg-[#f8fafc] py-24 px-6 md:px-12 text-slate-800 border-t border-slate-300">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-14 space-y-3">
                    <p className="text-xs tracking-[0.3em] uppercase text-amber-600 font-sans font-bold">
                        {data.eyebrow}
                    </p>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">
                        {data.heading}
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {data.members.map((member) => (
                        <div
                            key={member.name}
                            className="group relative overflow-hidden rounded-xl border border-slate-300 bg-white hover:border-amber-500 transition-all duration-300 shadow-md"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden bg-slate-200">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1">
                                <h3 className="text-white font-serif text-lg font-bold">{member.name}</h3>
                                <p className="text-amber-400 font-sans text-xs tracking-widest uppercase font-bold">{member.role}</p>
                                <p className="text-slate-200 font-sans text-xs mt-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                    {member.bio}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamSection;
