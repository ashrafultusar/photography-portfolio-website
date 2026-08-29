import React from "react";
import { getTestimonials } from "@/lib/data/testimonialData";
import TestimonialsSlider from "./TestimonialsSlider";

export default async function TestimonialsSection() {
    const testimonials = await getTestimonials();

    if (!testimonials || testimonials.length === 0) return null;

    return (
        <section id="testimonials" className="relative w-full bg-[#f8fafc] py-24 border-t border-slate-300 text-slate-800 overflow-hidden">
            {/* Top decorative gradient border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-12">
                {/* Header */}
                <div className="text-center space-y-3 max-w-2xl mx-auto">
                    <p className="text-xs tracking-[0.4em] uppercase text-amber-600 font-sans font-bold">
                        CLIENT TESTIMONIALS
                    </p>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-snug">
                        Words From Our Couples
                    </h2>
                    <div className="w-16 h-1 bg-amber-500 rounded-full mx-auto mt-2" />
                    <p className="text-slate-600 font-sans text-sm md:text-base leading-relaxed pt-1">
                        Real stories and heartfelt reviews from moments we had the honor to capture forever.
                    </p>
                </div>

                {/* Infinite Auto-sliding Swiper */}
                <TestimonialsSlider testimonials={testimonials} />
            </div>

            {/* Bottom decorative border */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        </section>
    );
}
