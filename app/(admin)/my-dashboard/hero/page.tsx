import HeroManager from "@/components/admin/hero/HeroManager";
import { getAdminHeroData } from "@/lib/data/heroData";

export const metadata = {
    title: "Hero Section Manager | Admin Dashboard",
    description: "Manage homepage background slider images and hero text overlay content",
};

export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
    const initialData = await getAdminHeroData();
    return <HeroManager initialData={initialData} />;
}

