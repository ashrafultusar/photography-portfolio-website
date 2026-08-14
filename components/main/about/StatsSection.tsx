'use client';

import React, { useEffect, useRef } from 'react';
import { StatsSectionData } from '@/lib/types/about';

interface StatsSectionProps {
    data: StatsSectionData;
}

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

function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
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
        <div ref={ref} className="text-center space-y-2 p-8 border border-slate-300 bg-white rounded-xl shadow-md">
            <p className="text-5xl font-serif font-bold text-slate-900">
                <span ref={numRef}>0</span>
                <span className="text-amber-600 font-bold">{suffix}</span>
            </p>
            <p className="text-xs tracking-widest uppercase text-slate-600 font-sans font-bold">{label}</p>
        </div>
    );
}

const StatsSection = ({ data }: StatsSectionProps) => {
    return (
        <section className="w-full bg-[#e2e8f0] py-24 px-6 md:px-12 border-t border-b border-slate-300">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-14 space-y-3">
                    <p className="text-xs tracking-[0.3em] uppercase text-amber-600 font-sans font-bold">
                        {data.eyebrow}
                    </p>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">
                        {data.heading}
                    </h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {data.stats.map((s) => <StatCard key={s.label} {...s} />)}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
