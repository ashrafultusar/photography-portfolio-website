"use client";

import Link from "next/link";

const TOP_STATS = [
    {
        title: "Portfolio Items",
        value: "24",
        subtitle: "Across all categories",
        bgColor: "bg-amber-400",
        textColor: "text-slate-950",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
        ),
    },
    {
        title: "Active Packages",
        value: "3",
        subtitle: "Essential, Premium, Luxury",
        bgColor: "bg-emerald-500",
        textColor: "text-white",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
        ),
    },
    {
        title: "Pending Messages",
        value: "5",
        subtitle: "Awaiting confirmation",
        bgColor: "bg-orange-500",
        textColor: "text-white",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        ),
    },
    {
        title: "Manage Content",
        value: "Quick Access",
        subtitle: "Open sections →",
        subtitleLink: "/my-dashboard/portfolio",
        bgColor: "bg-purple-100",
        textColor: "text-purple-600",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
        ),
    },
];

const CONTENT_SECTIONS = [
    {
        title: "Portfolio Albums",
        href: "/my-dashboard/portfolio",
        bgColor: "bg-blue-500",
        textColor: "text-white",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
        ),
    },
    {
        title: "Packages & Pricing",
        href: "/my-dashboard/packages",
        bgColor: "bg-emerald-500",
        textColor: "text-white",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
        ),
    },
    {
        title: "About Photographer",
        href: "/my-dashboard/about",
        bgColor: "bg-purple-500",
        textColor: "text-white",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
        ),
    },
    {
        title: "Booking Inquiries",
        href: "/my-dashboard/messages",
        bgColor: "bg-orange-500",
        textColor: "text-white",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
        ),
    },
    {
        title: "Hero Section",
        href: "/my-dashboard/portfolio",
        bgColor: "bg-amber-500",
        textColor: "text-slate-950",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
        ),
    },
    {
        title: "Gear & Studio Info",
        href: "/my-dashboard/about",
        bgColor: "bg-teal-500",
        textColor: "text-white",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
            </svg>
        ),
    },
];

const RECENT_BOOKINGS = [
    {
        id: 1,
        client: "Sarah Rahman & Rahim K.",
        email: "sarah.rahim@gmail.com",
        service: "Wedding Photography",
        date: "18 Aug 2026",
        status: "Pending",
    },
    {
        id: 2,
        client: "Tanvir Ahmed",
        email: "tanvir.a@corporate.com",
        service: "Corporate Event",
        date: "22 Aug 2026",
        status: "Contacted",
    },
    {
        id: 3,
        client: "Nadia & Faisal",
        email: "nadia.f@hotmail.com",
        service: "Pre-Wedding Shoot",
        date: "05 Sep 2026",
        status: "Confirmed",
    },
];

export default function DashboardOverview() {
    return (
        <div className="space-y-8">
            {/* Title & Subtitle */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Store overview and quick access to every editable homepage section.
                </p>
            </div>

            {/* Top 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {TOP_STATS.map((stat, i) => (
                    <div
                        key={i}
                        className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow"
                    >
                        <div>
                            <div className={`w-10 h-10 rounded-xl ${stat.bgColor} ${stat.textColor} flex items-center justify-center mb-4 font-bold shadow-sm`}>
                                {stat.icon}
                            </div>
                            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</h3>
                            <p className="text-xs font-semibold text-slate-700 mt-1">{stat.title}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{stat.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Manager & Recent Orders Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Messages Card */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                </svg>
                                <h2 className="text-base font-bold text-slate-900">Recent Booking Enquiries</h2>
                            </div>
                            <Link href="/my-dashboard/messages" className="text-xs font-semibold text-amber-600 hover:underline">
                                View all →
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {RECENT_BOOKINGS.map((b) => (
                                <div key={b.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{b.client}</p>
                                        <p className="text-xs text-slate-500">{b.service} • {b.date}</p>
                                    </div>
                                    <span
                                        className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${b.status === "Pending"
                                                ? "bg-amber-100 text-amber-800"
                                                : b.status === "Contacted"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-emerald-100 text-emerald-800"
                                            }`}
                                    >
                                        {b.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Manager Tile Card */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Content Manager</h2>
                            <p className="text-xs text-slate-400">Edit any homepage section</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {CONTENT_SECTIONS.map((sec, i) => (
                            <Link
                                key={i}
                                href={sec.href}
                                className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all flex items-center gap-3 group"
                            >
                                <div className={`w-9 h-9 rounded-lg ${sec.bgColor} ${sec.textColor} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                                    {sec.icon}
                                </div>
                                <span className="text-xs font-semibold text-slate-800 group-hover:text-slate-950">
                                    {sec.title}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
