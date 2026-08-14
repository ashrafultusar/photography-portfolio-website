export interface QuickLinkItem {
    name: string;
    href: string;
}

export interface FooterData {
    logoUrl?: string;
    brandName: string;
    brandLogoText: string;
    bio: string;
    location: string;
    phone: string;
    email: string;
    facebookUrl: string;
    instagramUrl: string;
    youtubeUrl: string;
    whatsappNumber: string;
    copyrightText: string;
    quickLinks: QuickLinkItem[];
}
