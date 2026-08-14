import { connectDB } from "@/db/dbConfig";
import Portfolio from "@/models/Portfolio";
import { PortfolioAlbumData } from "@/lib/types/portfolio";
import { portfolioAlbums as FALLBACK_ALBUMS } from "@/data/portfolioData";
import { unstable_cache } from "next/cache";

// Map fallback albums to PortfolioAlbumData format
const formattedFallbackAlbums: PortfolioAlbumData[] = FALLBACK_ALBUMS.map((a) => ({
    id: String(a.id),
    slug: a.slug,
    title: a.title,
    category: a.category,
    clientName: a.title,
    eventDate: a.date,
    location: a.location,
    coverImage: a.coverImage,
    description: a.description,
    featured: true,
    photoCount: a.images ? a.images.length : 0,
    images: a.images || [],
}));

/**
 * GET Portfolio albums summary (lightweight query for grids - excludes heavy image arrays)
 */
export const getPortfolioAlbumsSummaryData = unstable_cache(
    async (): Promise<PortfolioAlbumData[]> => {
        try {
            await connectDB();
            // Project lightweight fields to prevent fetching massive image arrays over the network
            const albums: any[] = await Portfolio.find()
                .select("title slug category clientName eventDate location coverImage description featured")
                .sort({ createdAt: -1 })
                .lean();

            if (albums && albums.length > 0) {
                return albums.map((a: any) => ({
                    id: a._id.toString(),
                    slug: a.slug,
                    title: a.title,
                    category: a.category,
                    clientName: a.clientName || "",
                    eventDate: a.eventDate || "",
                    location: a.location || "Dhaka, Bangladesh",
                    coverImage: a.coverImage,
                    description: a.description || "",
                    featured: a.featured || false,
                    photoCount: Array.isArray(a.images) ? a.images.length : 0,
                    images: [], // Lightweight: images array intentionally empty for grid views
                }));
            }
        } catch (error) {
            console.error("Error fetching portfolio albums summary from DB:", error);
        }

        return formattedFallbackAlbums.map((a) => ({ ...a, images: [] }));
    },
    ["portfolio-summary-cache"],
    { tags: ["portfolio"], revalidate: 3600 }
);

/**
 * GET All portfolio albums directly from MongoDB (full object data)
 */
export const getPortfolioAlbumsData = unstable_cache(
    async (): Promise<PortfolioAlbumData[]> => {
        try {
            await connectDB();
            const albums: any[] = await Portfolio.find().sort({ createdAt: -1 }).lean();

            if (albums && albums.length > 0) {
                return albums.map((a: any) => ({
                    id: a._id.toString(),
                    slug: a.slug,
                    title: a.title,
                    category: a.category,
                    clientName: a.clientName || "",
                    eventDate: a.eventDate || "",
                    location: a.location || "Dhaka, Bangladesh",
                    coverImage: a.coverImage,
                    description: a.description || "",
                    featured: a.featured || false,
                    photoCount: a.images?.length || 0,
                    images: a.images || [],
                }));
            }
        } catch (error) {
            console.error("Error fetching portfolio albums from DB:", error);
        }

        return formattedFallbackAlbums;
    },
    ["portfolio-full-cache"],
    { tags: ["portfolio"], revalidate: 3600 }
);

/**
 * Internal helper to fetch cached album metadata without heavy images array
 */
const getAlbumMetadataBySlug = (slugParam: string) => unstable_cache(
    async (s: string) => {
        try {
            await connectDB();
            const album: any = await Portfolio.findOne({ slug: s })
                .select("title slug category clientName eventDate location coverImage description featured")
                .lean();
            if (album) {
                return {
                    id: album._id.toString(),
                    slug: album.slug,
                    title: album.title,
                    category: album.category,
                    clientName: album.clientName || "",
                    eventDate: album.eventDate || "",
                    location: album.location || "Dhaka, Bangladesh",
                    coverImage: album.coverImage,
                    description: album.description || "",
                    featured: album.featured || false,
                };
            }
            return null;
        } catch (error) {
            console.error("Error fetching album metadata by slug:", error);
            return null;
        }
    },
    [`portfolio-meta-${slugParam}`],
    { tags: ["portfolio", `album-${slugParam}`], revalidate: 3600 }
)(slugParam);

/**
 * GET Single portfolio album by slug directly from MongoDB with caching
 */
export async function getAlbumBySlugData(slug: string): Promise<PortfolioAlbumData | null> {
    try {
        // Fetch lightweight metadata using unstable_cache
        const metadata = await getAlbumMetadataBySlug(slug);

        if (!metadata) {
            // Check static fallback
            const fallback = formattedFallbackAlbums.find((a) => a.slug === slug);
            return fallback || null;
        }

        // Fetch images directly from MongoDB to bypass Next.js 2MB data cache limit
        await connectDB();
        const albumWithImages = await Portfolio.findOne({ slug }).select("images").lean();
        const images = (albumWithImages as any)?.images || [];

        return {
            ...metadata,
            photoCount: images.length,
            images: images,
        };
    } catch (error) {
        console.error("Error fetching album by slug:", error);
        const fallback = formattedFallbackAlbums.find((a) => a.slug === slug);
        return fallback || null;
    }
}
