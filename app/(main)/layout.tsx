import React from 'react';
import Navbar from '@/components/main/Navbar';
import Footer from '@/components/main/Footer';
import { getFooterData } from '@/lib/data/footerData';
import { auth } from '@/auth';

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [footerData, session] = await Promise.all([
        getFooterData(),
        auth(),
    ]);

    const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'admin';

    return (
        <>
            <Navbar
                logoUrl={footerData.logoUrl}
                brandName={footerData.brandName}
                brandLogoText={footerData.brandLogoText}
                isAdmin={isAdmin}
            />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </>
    );
}
