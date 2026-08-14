export interface CategoryData {
    id: string;
    name: string;
    slug: string;
}

export interface PortfolioAlbumData {
    id: string;
    slug: string;
    title: string;
    category: string;
    clientName: string;
    eventDate: string;
    location: string;
    coverImage: string;
    description: string;
    featured: boolean;
    photoCount: number;
    images: { src: string; alt: string }[];
}
