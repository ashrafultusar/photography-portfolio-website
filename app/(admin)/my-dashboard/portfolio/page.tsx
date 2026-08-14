import PortfolioManager from "@/components/admin/portfolio/PortfolioManager";
import { getPortfolioAlbums } from "@/actions/portfolioActions";
import { getCategoriesAction } from "@/actions/categoryActions";

export default async function PortfolioAdminPage() {
    const [albumRes, catRes] = await Promise.all([
        getPortfolioAlbums(),
        getCategoriesAction(),
    ]);

    const initialAlbums = albumRes.success && albumRes.albums
        ? albumRes.albums.map((a: any) => ({
            id: a._id?.toString() || a.id || "",
            slug: a.slug,
            title: a.title,
            category: a.category,
            clientName: a.clientName || "",
            eventDate: a.eventDate || "",
            location: a.location || "",
            coverImage: a.coverImage || "",
            photoCount: a.images?.length || 0,
            description: a.description || "",
            featured: a.featured || false,
            images: a.images || [],
        }))
        : [];
    const initialCategories =
        catRes.success && catRes.categories
            ? ["All", ...catRes.categories.map((c: { name: string }) => c.name)]
            : ["All"];

    return (
        <PortfolioManager
            initialAlbums={initialAlbums}
            initialCategories={initialCategories}
        />
    );
}
