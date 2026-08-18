import React from 'react';
import Navbar from '@/components/main/Navbar';
import Footer from '@/components/main/Footer';
import { getFooterData } from '@/lib/data/footerData';

export const revalidate = 3600;

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const footerData = await getFooterData();

    return (
        <>
            <Navbar
                logoUrl={footerData.logoUrl}
                brandName={footerData.brandName}
                brandLogoText={footerData.brandLogoText}
            />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </>
    );
}

