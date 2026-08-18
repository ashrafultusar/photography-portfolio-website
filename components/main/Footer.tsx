import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { getFooterData } from "@/lib/data/footerData";

/* Inline SVG brand icons */
const FacebookIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width="16"
    height="16"
    aria-hidden="true"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="16"
    height="16"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width="16"
    height="16"
    aria-hidden="true"
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const Footer = async () => {
  const data = await getFooterData();

  return (
    <footer className="w-full bg-[#cbd5e1] text-slate-800 font-serif border-t border-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        {/* Brand info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {data.logoUrl ? (
              <div className="h-10 w-auto max-w-[160px] flex items-center overflow-hidden">
                <img
                  src={data.logoUrl}
                  alt={data.brandName || "Moment that matters"}
                  className="h-full w-auto object-contain max-h-10"
                />
              </div>
            ) : (
              <div className="w-9 h-9 border-2 border-amber-600 bg-amber-400 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-slate-950 text-xs font-black font-serif">
                  {data.brandLogoText || "MTM"}
                </span>
              </div>
            )}
            <span className="text-xl tracking-wide text-slate-950 font-bold">
              {data.brandName || "Moment that matters"}
            </span>
          </div>
          <p className="text-sm text-slate-700 font-sans leading-relaxed font-normal">
            {data.bio}
          </p>
        </div>

        {/* Quick links */}
        <div className="space-y-4">
          <h3 className="text-amber-700 text-sm font-sans font-bold tracking-widest uppercase">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm font-sans font-medium text-slate-800">
            {data.quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-amber-600 transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & social */}
        <div className="space-y-4">
          <h3 className="text-amber-700 text-sm font-sans font-bold tracking-widest uppercase">
            Get In Touch
          </h3>
          <div className="space-y-3 text-sm font-sans text-slate-700 font-medium">
            {data.location && (
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-amber-600 shrink-0" />
                <span>{data.location}</span>
              </div>
            )}
            {data.phone && (
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-amber-600 shrink-0" />
                <span>{data.phone}</span>
              </div>
            )}
            {data.email && (
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-amber-600 shrink-0" />
                <span>{data.email}</span>
              </div>
            )}
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-4 pt-2">
            {data.facebookUrl && (
              <a
                href={data.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-slate-200 border border-slate-400 flex items-center justify-center hover:bg-amber-400 hover:text-slate-950 transition duration-300 text-slate-800 shadow-sm"
              >
                <FacebookIcon />
              </a>
            )}
            {data?.instagramUrl && (
              <a
                href={data.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-slate-200 border border-slate-400 flex items-center justify-center hover:bg-amber-400 hover:text-slate-950 transition duration-300 text-slate-800 shadow-sm"
              >
                <InstagramIcon />
              </a>
            )}
            {data.youtubeUrl && (
              <a
                href={data.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-slate-200 border border-slate-400 flex items-center justify-center hover:bg-amber-400 hover:text-slate-950 transition duration-300 text-slate-800 shadow-sm"
              >
                <YoutubeIcon />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-slate-400/50 text-center text-xs font-sans text-slate-600 font-medium">
        <p suppressHydrationWarning>
          &copy; {new Date().getFullYear()} {data.copyrightText}
        </p>
      </div>

    </footer>
  );
};

export default Footer;
