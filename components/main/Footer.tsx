import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

/* Inline SVG brand icons (lucide-react v0.x doesn't ship Facebook/Instagram/Youtube) */
const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
);

const YoutubeIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
);

const Footer = () => {
    return (
        <footer className="w-full bg-neutral-950 text-gray-300 font-serif border-t border-white/10 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

                {/* Brand info */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 border-2 border-red-800/60 rounded-full flex items-center justify-center">
                            <span className="text-red-700 text-xs font-bold font-serif">TS</span>
                        </div>
                        <span className="text-2xl font-medium tracking-wide text-white">
                            The Story
                        </span>
                    </div>
                    <p className="text-sm text-gray-400 font-sans leading-relaxed">
                        Capturing your eternal moments and preserving your wedding stories
                        with cinematic elegance and professional photography.
                    </p>
                </div>

                {/* Quick links */}
                <div className="space-y-4">
                    <h3 className="text-white text-sm font-sans font-medium tracking-widest uppercase">
                        Quick Links
                    </h3>
                    <ul className="space-y-2 text-sm font-sans">
                        <li><Link href="#home" className="hover:text-white transition">Home</Link></li>
                        <li><Link href="#about" className="hover:text-white transition">About Us</Link></li>
                        <li><Link href="#portfolio" className="hover:text-white transition">Portfolio</Link></li>
                        <li><Link href="#packages" className="hover:text-white transition">Packages</Link></li>
                        <li><Link href="#book-us" className="hover:text-white transition">Book Us</Link></li>
                    </ul>
                </div>

                {/* Contact & social */}
                <div className="space-y-4">
                    <h3 className="text-white text-sm font-sans font-medium tracking-widest uppercase">
                        Get In Touch
                    </h3>
                    <div className="space-y-3 text-sm font-sans text-gray-400">
                        <div className="flex items-center gap-3">
                            <MapPin size={16} className="text-red-600 shrink-0" />
                            <span>Dhaka, Bangladesh</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone size={16} className="text-red-600 shrink-0" />
                            <span>+880 1234-567890</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail size={16} className="text-red-600 shrink-0" />
                            <span>info@shondhikkhon.com</span>
                        </div>
                    </div>

                    {/* Social icons */}
                    <div className="flex items-center gap-4 pt-2">
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition duration-300"
                        >
                            <FacebookIcon />
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition duration-300"
                        >
                            <InstagramIcon />
                        </a>
                        <a
                            href="https://youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="YouTube"
                            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition duration-300"
                        >
                            <YoutubeIcon />
                        </a>
                    </div>
                </div>

            </div>

            {/* Copyright */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-white/5 text-center text-xs font-sans text-gray-500">
                <p>&copy; {new Date().getFullYear()} The Story. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;