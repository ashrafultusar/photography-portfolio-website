export interface AboutHeroData {
    eyebrow: string;
    heading: string;
    subtext: string;
    bgImage: string;
}

export interface StoryItem {
    label: string;
    text: string;
}

export interface CompanyStoryData {
    eyebrow: string;
    heading: string;
    image: string;
    items: StoryItem[];
}

export interface TeamMember {
    name: string;
    role: string;
    image: string;
    bio: string;
}

export interface TeamSectionData {
    eyebrow: string;
    heading: string;
    members: TeamMember[];
}

export interface StatItem {
    value: number;
    suffix: string;
    label: string;
}

export interface StatsSectionData {
    eyebrow: string;
    heading: string;
    stats: StatItem[];
}

export interface WhyItem {
    icon: string; // 'camera' | 'film' | 'heart' | 'award' | 'clock' | 'map-pin' | 'star' | 'users'
    title: string;
    desc: string;
}

export interface WhyChooseUsData {
    eyebrow: string;
    heading: string;
    items: WhyItem[];
}

export interface HomeAboutStat {
    icon: string;
    value: string;
    label: string;
}

export interface HomeAboutData {
    eyebrow: string;
    heading: string;
    description1: string;
    description2: string;
    sinceYear: string;
    image1: string;
    image2: string;
    stats: HomeAboutStat[];
    ctaText: string;
    ctaLink: string;
}

export interface AboutPageData {
    homeSection: HomeAboutData;
    heroSection: AboutHeroData;
    companyStory: CompanyStoryData;
    teamSection: TeamSectionData;
    statsSection: StatsSectionData;
    whyChooseUs: WhyChooseUsData;
}

