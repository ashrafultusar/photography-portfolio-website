"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/sidebar";
import AdminHeader from "@/components/admin/Header";
import { useSession } from "next-auth/react";

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { status } = useSession();

    // 1. Prevent Browser Back-Forward Cache (BFCache) access after logout
    useEffect(() => {
        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) {
                // Page was restored from BFCache (back button) -> force hard reload so middleware runs
                window.location.reload();
            }
        };
        window.addEventListener("pageshow", handlePageShow);
        return () => window.removeEventListener("pageshow", handlePageShow);
    }, []);

    // 2. Client-side session guard fallback
    useEffect(() => {
        if (status === "unauthenticated") {
            window.location.href = "/login";
        }
    }, [status]);

    return (
        <div className="h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 flex">
            {/* Clean Modular Sidebar Component */}
            <AdminSidebar
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            {/* Main Container */}
            <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
                {/* Clean Modular Header Component */}
                <AdminHeader
                    setMobileOpen={setMobileOpen}
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                />

                {/* Scrollable Main Content */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-slate-50/50 scrollbar-thin">
                    {children}
                </main>
            </div>
        </div>
    );
}
