'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { TeamSectionData, TeamMember } from '@/lib/types/about';
import { X, Eye, User, Sparkles } from 'lucide-react';

interface TeamSectionProps {
    data: TeamSectionData;
}

const TeamSection = ({ data }: TeamSectionProps) => {
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (selectedMember) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedMember]);

    // Handle Escape key to close modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSelectedMember(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (!data || !data.members) return null;

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
                    {data.members.map((member, index) => (
                        <div
                            key={member.name}
                            className="group relative overflow-hidden rounded-xl border border-slate-300 bg-white hover:border-amber-500 transition-all duration-300 shadow-md flex flex-col justify-between"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden bg-slate-200">
                                <Image
                                    src={member.image}
                                    alt={`${member.name} - ${member.role}`}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    priority={index < 2}
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />

                                {/* Info on Card */}
                                <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2 z-10">
                                    <div>
                                        <h3 className="text-white font-serif text-lg font-bold group-hover:text-amber-300 transition-colors">
                                            {member.name}
                                        </h3>
                                        <p className="text-amber-400 font-sans text-xs tracking-widest uppercase font-bold">
                                            {member.role}
                                        </p>
                                    </div>

                                    {/* View More Button */}
                                    <button
                                        onClick={() => setSelectedMember(member)}
                                        className="w-full mt-2 py-2 px-3 bg-amber-600/90 hover:bg-amber-600 text-white rounded-lg font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-[0.98]"
                                        aria-label={`View full bio and details for ${member.name}, ${member.role}`}
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                        <span>View More</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Team Member Bio Modal */}
            {selectedMember && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setSelectedMember(null)}
                >
                    <div
                        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col md:flex-row animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Close Button */}
                        <button
                            onClick={() => setSelectedMember(null)}
                            className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer bg-white/80 md:bg-transparent shadow-sm md:shadow-none"
                            aria-label="Close modal window"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Modal Image */}
                        <div className="w-full md:w-5/12 h-64 md:h-auto relative bg-slate-900 overflow-hidden shrink-0">
                            <Image
                                src={selectedMember.image}
                                alt={`Portrait of ${selectedMember.name}`}
                                fill
                                sizes="(max-width: 768px) 100vw, 40vw"
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent md:hidden pointer-events-none" />
                        </div>

                        {/* Modal Content */}
                        <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col justify-between bg-white text-slate-800">
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 rounded-full border border-amber-200/80 mb-3">
                                    <Sparkles className="w-3 h-3 text-amber-500" />
                                    <span>{selectedMember.role}</span>
                                </div>

                                <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-2">
                                    {selectedMember.name}
                                </h3>

                                <div className="w-12 h-1 bg-amber-500 rounded-full mb-5" />

                                <div className="space-y-2">
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5 text-amber-600" />
                                        <span>Short Bio</span>
                                    </p>
                                    <p className="text-slate-600 text-sm md:text-base leading-relaxed font-sans max-h-60 overflow-y-auto pr-1">
                                        {selectedMember.bio || 'No bio provided for this team member.'}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
                                <button
                                    onClick={() => setSelectedMember(null)}
                                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow hover:shadow-md cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default TeamSection;