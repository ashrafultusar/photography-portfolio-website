export interface PackageItem {
    name: string;
    tagline: string;
    price: string;
    unit: string;
    featured: boolean;
    features: string[];
}

export interface AddOnItem {
    icon: string; // icon key: 'zap' | 'wind' | 'clapperboard' | 'camera' | 'star' | 'heart'
    title: string;
    desc: string;
    price: string;
}

export interface PackagesHeroData {
    eyebrow: string;
    heading: string;
    subtext: string;
    bgImage: string;
}

export interface PricingSectionData {
    sectionEyebrow: string;
    sectionHeading: string;
    sectionHeadingAccent: string;
    sectionDesc: string;
    noteText: string;
    packages: PackageItem[];
}

export interface AddOnsSectionData {
    sectionEyebrow: string;
    sectionHeading: string;
    sectionDesc: string;
    ctaNote: string;
    addOns: AddOnItem[];
}

export interface PackagesPageData {
    heroSection: PackagesHeroData;
    pricingSection: PricingSectionData;
    addOnsSection: AddOnsSectionData;
}
