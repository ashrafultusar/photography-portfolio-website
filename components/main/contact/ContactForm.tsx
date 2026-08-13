'use client';

import React, { useState } from 'react';

const packages = ['Silver – ৳25,000', 'Gold – ৳45,000', 'Platinum – ৳75,000', 'Custom'];

const ContactForm = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="text-center py-16">
                <div className="w-14 h-14 rounded-full border border-red-600 flex items-center justify-center mx-auto mb-4">
                    <span className="text-red-500 text-2xl">✓</span>
                </div>
                <h3 className="text-white font-serif text-2xl mb-2">Message Received!</h3>
                <p className="text-gray-400 font-sans text-sm">
                    We&apos;ll get back to you within 24 hours.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs tracking-widest uppercase text-gray-500 font-sans mb-2">
                        Your Name
                    </label>
                    <input
                        type="text"
                        required
                        placeholder="Rahim & Rima"
                        className="w-full bg-white/5 border border-white/15 text-white placeholder-gray-600 px-4 py-3 text-sm font-sans focus:outline-none focus:border-red-600/60 transition rounded-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs tracking-widest uppercase text-gray-500 font-sans mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="w-full bg-white/5 border border-white/15 text-white placeholder-gray-600 px-4 py-3 text-sm font-sans focus:outline-none focus:border-red-600/60 transition rounded-sm"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs tracking-widest uppercase text-gray-500 font-sans mb-2">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        placeholder="+880 17XXXXXXXX"
                        className="w-full bg-white/5 border border-white/15 text-white placeholder-gray-600 px-4 py-3 text-sm font-sans focus:outline-none focus:border-red-600/60 transition rounded-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs tracking-widest uppercase text-gray-500 font-sans mb-2">
                        Event Date
                    </label>
                    <input
                        type="date"
                        className="w-full bg-white/5 border border-white/15 text-white px-4 py-3 text-sm font-sans focus:outline-none focus:border-red-600/60 transition rounded-sm [color-scheme:dark]"
                    />
                </div>
            </div>
            <div>
                <label className="block text-xs tracking-widest uppercase text-gray-500 font-sans mb-2">
                    Package Interest
                </label>
                <select className="w-full bg-neutral-900 border border-white/15 text-gray-300 px-4 py-3 text-sm font-sans focus:outline-none focus:border-red-600/60 transition rounded-sm">
                    <option value="">Select a package</option>
                    {packages.map((p) => <option key={p}>{p}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-xs tracking-widest uppercase text-gray-500 font-sans mb-2">
                    Tell Us About Your Event
                </label>
                <textarea
                    rows={4}
                    placeholder="Wedding venue, guest count, special requests..."
                    className="w-full bg-white/5 border border-white/15 text-white placeholder-gray-600 px-4 py-3 text-sm font-sans focus:outline-none focus:border-red-600/60 transition resize-none rounded-sm"
                />
            </div>
            <button
                type="submit"
                className="w-full bg-red-800 hover:bg-red-700 text-white py-3 text-sm tracking-widest uppercase font-sans transition-all duration-300 rounded-sm"
            >
                Send Message
            </button>
        </form>
    );
};

export default ContactForm;
