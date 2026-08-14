export interface HeroImageData {
    src: string;
    alt: string;
}

export interface HeroSectionData {
    subtitle: string;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    images: HeroImageData[];
}
