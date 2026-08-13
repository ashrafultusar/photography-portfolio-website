'use client';

import React, { useEffect, useRef } from 'react';

const stats = [
    { value: 8, suffix: '+', label: 'Years of Experience' },
    { value: 500, suffix: '+', label: 'Weddings Covered' },
    { value: 20, suffix: '+', label: 'Cities Across BD' },
    { value: 98, suffix: '%', label: 'Happy Clients' },
];

function useCountUp(target: number, duration = 1800, start = false) {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!start) return;
        const el = ref.current;
        if (!el) return;
        let startTime: number | null = null;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            el.textContent = String(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = String(target);
        };
        requestAnimationFrame(step);
    }, [target, duration, start]);

    return ref;
}

function StatCard({ value, suffix, label }: (typeof stats)[0]) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = React.useState(false);
    const numRef = useCountUp(value, 1800, visible);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
            { threshold: 0.4 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className="text-center space-y-2 p-8 border border-white/10 bg-white/5 rounded-sm">
            <p className="text-5xl font-serif font-light text-white">
                <span ref={numRef}>0</span>
                <span className="text-red-500">{suffix}</span>
            </p>
            <p className="text-xs tracking-widest uppercase text-gray-400 font-sans">{label}</p>
        </div>
    );
}

const StatsSection = () => {
    return (
        <section className="w-full bg-neutral-900 py-24 px-6 md:px-12">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-14 space-y-3">
                    <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-sans">
                        By The Numbers
                    </p>
                    <h2 className="text-4xl md:text-5xl font-serif font-light text-white">
                        Our Journey So Far
                    </h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((s) => <StatCard key={s.label} {...s} />)}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
