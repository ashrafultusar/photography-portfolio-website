import { connectDB } from "@/db/dbConfig";
import Hero from "@/models/Hero";
import { HeroSectionData } from "@/lib/types/hero";
import { unstable_cache } from "next/cache";

const FALLBACK_HERO: HeroSectionData = {
    subtitle: "WEDDING & EVENT PHOTOGRAPHY",
    title: "The Story",
    description: "Capturing your eternal moments with cinematic elegance.",
    buttonText: "Book Us",
    buttonLink: "#book-us",
    images: [
        { src: "/hero/1.jpg", alt: "Shondhikkhon Wedding Couple Walking in Outdoor Nature Setting" },
        { src: "/hero/2.jpg", alt: "Happy Bride and Groom Smiling During Wedding Ceremony" },
        { src: "/hero/3.jpg", alt: "Beautiful Wedding Photography and Details" },
        { src: "/hero/4.jpg", alt: "Beautiful Wedding Photography and Details" },
    ],
};

/**
 * GET Hero section content and slider images directly from MongoDB with proper module-level caching
 */
export const getHeroData = unstable_cache(
    async (): Promise<HeroSectionData> => {
        try {
            await connectDB();
            const hero: any = await Hero.findOne()
                .select("subtitle title description buttonText buttonLink images")
                .lean();

            if (hero) {
                return {
                    subtitle: hero.subtitle || FALLBACK_HERO.subtitle,
                    title: hero.title || FALLBACK_HERO.title,
                    description: hero.description || FALLBACK_HERO.description,
                    buttonText: hero.buttonText || FALLBACK_HERO.buttonText,
                    buttonLink: hero.buttonLink || FALLBACK_HERO.buttonLink,
                    images:
                        hero.images && hero.images.length > 0
                            ? hero.images.map((img: any) => ({
                                src: img.src,
                                alt: img.alt || "Photography Hero Slider Image",
                            }))
                            : FALLBACK_HERO.images,
                };
            }
        } catch (error) {
            console.error("Error fetching Hero section data:", error);
        }

        return FALLBACK_HERO;
    },
    ["hero-data-cache"],
    { tags: ["hero"], revalidate: 3600 }
);

/**
 * GET uncached Hero section content directly from MongoDB for Admin Dashboard (instant loading & real-time accuracy)
 */
export async function getAdminHeroData(): Promise<HeroSectionData> {
    try {
        await connectDB();
        const hero: any = await Hero.findOne()
            .select("subtitle title description buttonText buttonLink images")
            .lean();

        if (hero) {
            return {
                subtitle: hero.subtitle || FALLBACK_HERO.subtitle,
                title: hero.title || FALLBACK_HERO.title,
                description: hero.description || FALLBACK_HERO.description,
                buttonText: hero.buttonText || FALLBACK_HERO.buttonText,
                buttonLink: hero.buttonLink || FALLBACK_HERO.buttonLink,
                images:
                    hero.images && hero.images.length > 0
                        ? hero.images.map((img: any) => ({
                            src: img.src,
                            alt: img.alt || "Photography Hero Slider Image",
                        }))
                        : FALLBACK_HERO.images,
            };
        }
    } catch (error) {
        console.error("Error fetching Admin Hero section data:", error);
    }

    return FALLBACK_HERO;
}

