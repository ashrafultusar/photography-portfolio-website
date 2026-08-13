import React from 'react';
import Navbar from '@/components/main/Navbar';
import Footer from '@/components/main/Footer';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </>
    );
}