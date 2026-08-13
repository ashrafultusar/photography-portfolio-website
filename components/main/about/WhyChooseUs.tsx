import React from 'react';
import { Camera, Film, Heart, Award, Clock, MapPin } from 'lucide-react';

const reasons = [
    {
        icon: Camera,
        title: 'Cinematic Eye',
        desc: 'Every shot is composed with purpose — we don\'t just take photos, we craft frames.',
    },
    {
        icon: Film,
        title: 'Film-Quality Video',
        desc: 'Our videos aren\'t slideshows. They\'re short films that move you to tears.',
    },
    {
        icon: Heart,
        title: 'Couple-First Approach',
        desc: 'We melt into the background so you can be truly yourselves on your special day.',
    },
    {
        icon: Award,
        title: 'Award-Winning Team',
        desc: 'Recognised nationally for wedding photography excellence since 2018.',
    },
    {
        icon: Clock,
        title: 'On-Time Delivery',
        desc: 'Your memories are delivered on schedule — no endless waiting.',
    },
    {
        icon: MapPin,
        title: 'Anywhere in BD',
        desc: 'From Dhaka rooftops to Cox\'s Bazar beaches — we travel wherever your story is.',
    },
];

const WhyChooseUs = () => {
    return (
        <section className="w-full bg-neutral-950 py-24 px-6 md:px-12">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-14 space-y-3">
                    <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-sans">
                        Why We&apos;re Different
                    </p>
                    <h2 className="text-4xl md:text-5xl font-serif font-light text-white">
                        Why Choose The Story
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reasons.map(({ icon: Icon, title, desc }) => (
                        <div
                            key={title}
                            className="group p-8 border border-white/10 bg-white/5 hover:border-red-700/50 hover:bg-red-900/10 rounded-sm transition-all duration-300 space-y-4"
                        >
                            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-red-700/40 bg-red-900/20 text-red-500 group-hover:scale-110 transition-transform duration-300">
                                <Icon size={20} />
                            </span>
                            <h3 className="text-white font-serif text-xl">{title}</h3>
                            <p className="text-gray-400 font-sans text-sm leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
