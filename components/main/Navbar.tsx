'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'Team' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/packages', label: 'Packages' },
  { href: '/contact', label: 'Contact' },
];

interface NavbarProps {
  logoUrl?: string;
  brandName?: string;
  brandLogoText?: string;
  isAdmin?: boolean;
}

const Navbar = ({ logoUrl = "/logo.jpeg", brandName = "Moment that matters", brandLogoText = "MTM", isAdmin = false }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const showAdminButton =
    mounted && status === 'authenticated'
      ? (session?.user as { role?: string } | undefined)?.role === 'admin'
      : false;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-[#e2e8f0]/95 backdrop-blur-md border-b border-slate-300 py-3 shadow-md'
        : 'bg-[#e2e8f0]/85 backdrop-blur-sm border-b border-slate-300/70 py-4'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          {logoUrl ? (
            <div className="h-10 w-auto max-w-[160px] flex items-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <img
                src={logoUrl}
                alt={brandName}
                className="h-full w-auto object-contain max-h-10"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
              <span className="font-serif text-slate-950 font-black text-xl tracking-tighter">
                {brandLogoText}
              </span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-serif text-base md:text-lg tracking-widest uppercase font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
              {brandName}
            </span>
            <span className="text-[9px] tracking-[0.3em] uppercase text-slate-600 font-sans font-medium -mt-1">
              Photography
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs tracking-widest uppercase font-sans transition-colors duration-200 relative py-1 ${isActive
                  ? 'text-amber-600 font-bold'
                  : 'text-slate-800 hover:text-amber-600 font-medium'
                  }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          {showAdminButton && (
            <Link
              href="/my-dashboard"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs tracking-widest uppercase font-sans font-bold transition-all duration-300 rounded-sm shadow-md border border-slate-700"
            >
              Admin Panel
            </Link>
          )}
          <Link
            href="/contact"
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs tracking-widest uppercase font-sans font-bold transition-all duration-300 rounded-sm shadow-md"
          >
            Book Now
          </Link>
      
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-slate-800 hover:text-amber-600 focus:outline-none p-1"
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-[#e2e8f0] border-b border-slate-300 px-6 py-6 space-y-4 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block text-xs tracking-widest uppercase font-sans py-2 ${pathname === link.href
                ? 'text-amber-600 font-bold border-l-2 border-amber-500 pl-3'
                : 'text-slate-800 hover:text-amber-600 font-medium pl-3'
                }`}
            >
              {link.label}
            </Link>
          ))}
          {showAdminButton && (
            <Link
              href="/my-dashboard"
              onClick={() => setMobileOpen(false)}
              className="block text-center mt-4 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs tracking-widest uppercase font-sans font-bold rounded-sm shadow-md border border-slate-700"
            >
              Admin Panel
            </Link>
          )}
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="block text-center mt-4 px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs tracking-widest uppercase font-sans font-bold rounded-sm shadow-md"
          >
            Book Now
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;

