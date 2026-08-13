// Shared portfolio album data
// Used by: PortfolioGallery (album grid) & PortfolioDetail (per-album page)

export interface PortfolioImage {
    src: string;
    alt: string;
}

export interface PortfolioAlbum {
    id: number;
    slug: string;
    title: string;
    category: string;
    date: string;
    location: string;
    description: string;
    coverImage: string;
    images: PortfolioImage[];
}

export const portfolioAlbums: PortfolioAlbum[] = [
    {
        id: 1,
        slug: 'rahim-sarah',
        title: 'Rahim & Sarah',
        category: 'Wedding',
        date: 'December 10, 2024',
        location: 'Sundarban, Dhaka',
        description: 'A magical winter wedding filled with love, laughter, and timeless elegance.',
        coverImage: '/hero/1.jpg',
        images: [
            { src: '/hero/1.jpg', alt: 'Bride and groom walking hand in hand' },
            { src: '/hero/2.jpg', alt: 'Wedding ceremony vows' },
            { src: '/hero/3.jpg', alt: 'Bridal portrait close-up' },
            { src: '/hero/4.jpg', alt: 'Couple under golden arch' },
            { src: '/hero/1.jpg', alt: 'Reception dance floor' },
            { src: '/hero/2.jpg', alt: 'Candid laughing moment' },
            { src: '/hero/3.jpg', alt: 'Ring exchange ceremony' },
            { src: '/hero/4.jpg', alt: 'Silhouette at sunset' },
            { src: '/hero/1.jpg', alt: 'Family group portrait' },
        ],
    },
    {
        id: 2,
        slug: 'nadia-tanvir',
        title: 'Nadia & Tanvir',
        category: 'Holud',
        date: 'November 5, 2024',
        location: 'Banani, Dhaka',
        description: 'A vibrant and colourful Holud celebration bursting with joy and tradition.',
        coverImage: '/hero/2.jpg',
        images: [
            { src: '/hero/2.jpg', alt: 'Holud ceremony setup' },
            { src: '/hero/3.jpg', alt: 'Bride adorned with turmeric' },
            { src: '/hero/4.jpg', alt: 'Family celebration dance' },
            { src: '/hero/1.jpg', alt: 'Flower decoration detail' },
            { src: '/hero/2.jpg', alt: 'Groom arrival procession' },
            { src: '/hero/3.jpg', alt: 'Candid holud moments' },
        ],
    },
    {
        id: 3,
        slug: 'anika-faisal',
        title: 'Anika & Faisal',
        category: 'Nikah',
        date: 'October 20, 2024',
        location: 'Gulshan, Dhaka',
        description: 'An intimate Nikah ceremony captured with warmth and reverence.',
        coverImage: '/hero/3.jpg',
        images: [
            { src: '/hero/3.jpg', alt: 'Nikah ceremony hall' },
            { src: '/hero/4.jpg', alt: 'Qazi reading the nikah' },
            { src: '/hero/1.jpg', alt: 'Bride signing documents' },
            { src: '/hero/2.jpg', alt: 'Couple first glance' },
            { src: '/hero/3.jpg', alt: 'Family prayers together' },
        ],
    },
    {
        id: 4,
        slug: 'sara-hasan',
        title: 'Sara & Hasan',
        category: 'Reception',
        date: 'September 14, 2024',
        location: 'Le Méridien, Dhaka',
        description: 'A grand reception evening glimmering with elegance and heartfelt celebration.',
        coverImage: '/hero/4.jpg',
        images: [
            { src: '/hero/4.jpg', alt: 'Reception hall grand entrance' },
            { src: '/hero/1.jpg', alt: 'First dance on stage' },
            { src: '/hero/2.jpg', alt: 'Cake cutting ceremony' },
            { src: '/hero/3.jpg', alt: 'Couple portrait at reception' },
            { src: '/hero/4.jpg', alt: 'Friends celebrating together' },
            { src: '/hero/1.jpg', alt: 'Table floral centerpiece detail' },
            { src: '/hero/2.jpg', alt: 'Bride tossing bouquet' },
        ],
    },
    {
        id: 5,
        slug: 'riya-imran',
        title: 'Riya & Imran',
        category: 'Pre-Wedding',
        date: 'August 2, 2024',
        location: 'Cox\'s Bazar',
        description: 'A breathtaking pre-wedding shoot along the longest natural sea beach in the world.',
        coverImage: '/hero/1.jpg',
        images: [
            { src: '/hero/1.jpg', alt: 'Couple by the sea at sunrise' },
            { src: '/hero/2.jpg', alt: 'Walking on the sandy shore' },
            { src: '/hero/3.jpg', alt: 'Golden hour portrait' },
            { src: '/hero/4.jpg', alt: 'Silhouette against waves' },
            { src: '/hero/1.jpg', alt: 'Candid beach laughter' },
            { src: '/hero/2.jpg', alt: 'Couple on boat deck' },
        ],
    },
    {
        id: 6,
        slug: 'mim-sabbir',
        title: 'Mim & Sabbir',
        category: 'Engagement',
        date: 'July 18, 2024',
        location: 'Dhanmondi, Dhaka',
        description: 'A charming engagement shoot capturing the excitement of a new beginning.',
        coverImage: '/hero/2.jpg',
        images: [
            { src: '/hero/2.jpg', alt: 'Engagement ring close-up' },
            { src: '/hero/3.jpg', alt: 'Couple portrait in garden' },
            { src: '/hero/4.jpg', alt: 'Ring presentation moment' },
            { src: '/hero/1.jpg', alt: 'Candid joyful reaction' },
            { src: '/hero/2.jpg', alt: 'Couple walking in park' },
        ],
    },
];

export function getAlbumBySlug(slug: string): PortfolioAlbum | undefined {
    return portfolioAlbums.find((a) => a.slug === slug);
}
