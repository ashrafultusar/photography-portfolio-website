import React from 'react';

const team = [
    {
        name: 'Rafiq Ahmed',
        role: 'Lead Photographer',
        image: '/hero/1.jpg',
        bio: '8 years crafting visual stories across Bangladesh.',
    },
    {
        name: 'Nusrat Jahan',
        role: 'Senior Videographer',
        image: '/hero/2.jpg',
        bio: 'Cinematic storyteller with a passion for emotion.',
    },
    {
        name: 'Tanvir Hassan',
        role: 'Drone Operator',
        image: '/hero/3.jpg',
        bio: 'Aerial maestro capturing breathtaking perspectives.',
    },
    {
        name: 'Mitu Akter',
        role: 'Photo Editor',
        image: '/hero/4.jpg',
        bio: 'Transforms raw frames into timeless memories.',
    },
];

const TeamSection = () => {
    return (
        <section className="w-full bg-neutral-900 py-24 px-6 md:px-12">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-14 space-y-3">
                    <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-sans">
                        The People
                    </p>
                    <h2 className="text-4xl md:text-5xl font-serif font-light text-white">
                        Meet Our Team
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {team.map((member) => (
                        <div
                            key={member.name}
                            className="group relative overflow-hidden rounded-sm border border-white/10 hover:border-red-700/40 transition-all duration-300"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1">
                                <h3 className="text-white font-serif text-lg">{member.name}</h3>
                                <p className="text-red-400 font-sans text-xs tracking-widest uppercase">{member.role}</p>
                                <p className="text-gray-400 font-sans text-xs mt-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
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
