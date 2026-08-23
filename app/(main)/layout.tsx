import React from 'react';
import Navbar from '@/components/main/Navbar';
import Footer from '@/components/main/Footer';
import FloatingWhatsApp from '@/components/main/shared/FloatingWhatsApp';
import { getFooterData } from '@/lib/data/footerData';

export const dynamic = 'force-static';
export const revalidate = 3600;

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const footerData = await getFooterData();

    return (
        <>
            <head>
                <link rel="preconnect" href="https://res.cloudinary.com" />
                <link rel="dns-prefetch" href="https://res.cloudinary.com" />
            </head>
            <Navbar
                logoUrl={footerData.logoUrl}
                brandName={footerData.brandName}
                brandLogoText={footerData.brandLogoText}
            />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
            <FloatingWhatsApp />
        </>
    );
}

