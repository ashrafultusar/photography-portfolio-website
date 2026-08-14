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
            <div className="text-center py-16 bg-white/90 border border-slate-300 rounded-sm shadow-sm">
                <div className="w-14 h-14 rounded-full border-2 border-amber-500 bg-amber-400/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-amber-700 text-2xl font-bold">✓</span>
                </div>
                <h3 className="text-slate-900 font-serif text-2xl font-bold mb-2">Message Received!</h3>
                <p className="text-slate-700 font-sans text-sm font-medium">
                    We&apos;ll get back to you within 24 hours.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs tracking-widest uppercase text-slate-700 font-sans font-bold mb-2">
                        Your Name
                    </label>
                    <input
                        type="text"
                        required
                        placeholder="Rahim & Rima"
                        className="w-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 px-4 py-3 text-sm font-sans focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition rounded-sm shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs tracking-widest uppercase text-slate-700 font-sans font-bold mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="w-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 px-4 py-3 text-sm font-sans focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition rounded-sm shadow-sm"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs tracking-widest uppercase text-slate-700 font-sans font-bold mb-2">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        placeholder="+880 17XXXXXXXX"
                        className="w-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 px-4 py-3 text-sm font-sans focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition rounded-sm shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs tracking-widest uppercase text-slate-700 font-sans font-bold mb-2">
                        Event Date
                    </label>
                    <input
                        type="date"
                        className="w-full bg-white border border-slate-300 text-slate-900 px-4 py-3 text-sm font-sans focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition rounded-sm shadow-sm [color-scheme:light]"
                    />
                </div>
            </div>
            <div>
                <label className="block text-xs tracking-widest uppercase text-slate-700 font-sans font-bold mb-2">
                    Package Interest
                </label>
                <select className="w-full bg-white border border-slate-300 text-slate-900 px-4 py-3 text-sm font-sans focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition rounded-sm shadow-sm">
                    <option value="">Select a package</option>
                    {packages.map((p) => <option key={p}>{p}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-xs tracking-widest uppercase text-slate-700 font-sans font-bold mb-2">
                    Tell Us About Your Event
                </label>
                <textarea
                    rows={4}
                    placeholder="Wedding venue, guest count, special requests..."
                    className="w-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 px-4 py-3 text-sm font-sans focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition resize-none rounded-sm shadow-sm"
                />
            </div>
            <button
                type="submit"
                className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-3.5 text-xs tracking-widest uppercase font-sans transition-all duration-300 rounded-sm shadow-md"
            >
                Send Message
            </button>
        </form>
    );
};

export default ContactForm;
