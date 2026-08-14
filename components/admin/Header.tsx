"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminHeaderProps {
    setMobileOpen: (open: boolean) => void;
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
}

export default function AdminHeader({
    setMobileOpen,
    isCollapsed,
    setIsCollapsed,
}: AdminHeaderProps) {
    const pathname = usePathname();

    const getPageTitle = () => {
        if (pathname === "/my-dashboard") return "Dashboard";
        const segment = pathname.split("/").pop() || "Dashboard";
        return segment.replace("-", " ");
    };

    return (
        <header className="h-16 border-b border-slate-200/80 bg-white px-6 flex items-center justify-between shrink-0 z-30 shadow-sm">
            <div className="flex items-center gap-4">
                {/* Mobile Drawer Trigger */}
                <button
                    onClick={() => setMobileOpen(true)}
                    className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 lg:hidden border border-slate-200"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>

                {/* Collapse Toggle Trigger */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:flex p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
                    title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    <svg
                        className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>

                <div>
                    <h2 className="text-base font-bold text-slate-900 capitalize">{getPageTitle()}</h2>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Link
                    href="/"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all"
                >
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                    <span>View Storefront</span>
                </Link>
            </div>
        </header>
    );
}
