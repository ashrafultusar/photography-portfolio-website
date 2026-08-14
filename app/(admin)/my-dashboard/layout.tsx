"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/sidebar";
import AdminHeader from "@/components/admin/Header";

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

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