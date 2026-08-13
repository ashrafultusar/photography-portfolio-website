"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Menu } from "lucide-react";

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "/about" },
  { label: "PORTFOLIO", href: "/portfolio" },
  { label: "PACKAGES", href: "/packages" },
  { label: "BOOK US", href: "/contact" },
];

function ActiveLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative transition duration-300 hover:text-white
        after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-red-600
        after:transition-all after:duration-300 hover:after:w-full
        ${isActive ? "text-white after:w-full" : "after:w-0"}`}
    >
      {label}
    </Link>
  );
}

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 md:px-12">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-3 group" onClick={closeMenu}>
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            className="shrink-0 rounded-full border border-red-800/60"
            aria-hidden="true"
          >
            <rect width="40" height="40" rx="20" fill="#1a0505" />
            <text
              x="50%"
              y="55%"
              dominantBaseline="middle"
              textAnchor="middle"
              fill="#cc2200"
              fontSize="11"
              fontFamily="Georgia, serif"
              fontWeight="bold"
            >
              TS
            </text>
          </svg>
          <span className="text-xl md:text-2xl font-serif font-medium tracking-wider text-white">
            The Story
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-sans font-light tracking-widest text-gray-300">
          {navLinks.map((link) => (
            <ActiveLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        {/* Mobile burger button */}
        <button
          className="md:hidden text-white p-1 focus:outline-none"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-md border-t border-white/10">
          <nav className="flex flex-col px-6 py-6 gap-5 text-sm font-sans tracking-widest text-gray-300">
            {navLinks.map((link) => (
              <ActiveLink
                key={link.href}
                href={link.href}
                label={link.label}
                onClick={closeMenu}
              />
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
