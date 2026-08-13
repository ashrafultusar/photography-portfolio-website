import React from 'react';

const BookUs = () => {
    return (
        <section
            id="book-us"
            className="w-full bg-neutral-900 py-24 px-6 md:px-12"
        >
            <div className="max-w-2xl mx-auto text-center space-y-8">
                <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-sans">
                    Let&apos;s Connect
                </p>
                <h2 className="text-4xl md:text-5xl font-serif font-light text-white">
                    Book Your Date
                </h2>
                <p className="text-gray-400 font-sans text-base">
                    Dates fill up fast. Send us a message and let&apos;s create
                    something beautiful together.
                </p>
                <form className="space-y-4 text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="w-full bg-white/5 border border-white/15 text-white placeholder-gray-500 px-4 py-3 text-sm font-sans focus:outline-none focus:border-white/40 transition"
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            className="w-full bg-white/5 border border-white/15 text-white placeholder-gray-500 px-4 py-3 text-sm font-sans focus:outline-none focus:border-white/40 transition"
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Event Date"
                        className="w-full bg-white/5 border border-white/15 text-white placeholder-gray-500 px-4 py-3 text-sm font-sans focus:outline-none focus:border-white/40 transition"
                    />
                    <textarea
                        rows={4}
                        placeholder="Tell us about your event..."
                        className="w-full bg-white/5 border border-white/15 text-white placeholder-gray-500 px-4 py-3 text-sm font-sans focus:outline-none focus:border-white/40 transition resize-none"
                    />
                    <button
                        type="submit"
                        className="w-full bg-red-800 hover:bg-red-700 text-white py-3 text-sm tracking-widest uppercase font-sans transition-all duration-300"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </section>
    );
};

export default BookUs;
