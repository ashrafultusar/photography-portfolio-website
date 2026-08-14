"use server";

import { connectDB } from "@/db/dbConfig";
import Category from "@/models/Category";
import { CategoryData } from "@/lib/types/portfolio";
import { unstable_cache } from "next/cache";

const INITIAL_CATEGORIES = [
    "Wedding",
    "Holud",
    "Nikah",
    "Reception",
    "Pre-Wedding",
    "Engagement",
    "Portrait",
    "Event",
    "Commercial",
];

/**
 * GET Category names list from DB (cached)
 */
export async function getCategoryNames(): Promise<string[]> {
    const cachedFetch = unstable_cache(
        async (): Promise<string[]> => {
            try {
                await connectDB();
                let categories: any[] = await Category.find().sort({ name: 1 }).lean();

                // Seed DB with initial categories if empty
                if (categories.length === 0) {
                    const seedDocs = INITIAL_CATEGORIES.map((name) => ({
                        name,
                        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    }));
                    await Category.insertMany(seedDocs);
                    categories = await Category.find().sort({ name: 1 }).lean();
                }

                return categories.map((c) => c.name);
            } catch (error) {
                console.error("Error fetching category names:", error);
                return INITIAL_CATEGORIES;
            }
        },
        ["category-names-cache"],
        { tags: ["categories"], revalidate: 3600 }
    );

    return cachedFetch();
}

/**
 * GET All Category records from DB (cached)
 */
export async function getCategories(): Promise<{ success: boolean; categories: CategoryData[]; error?: string }> {
    const cachedFetch = unstable_cache(
        async (): Promise<{ success: boolean; categories: CategoryData[]; error?: string }> => {
            try {
                await connectDB();
                let dbCategories: any[] = await Category.find().sort({ name: 1 }).lean();

                // Seed DB with initial categories if empty
                if (dbCategories.length === 0) {
                    const seedDocs = INITIAL_CATEGORIES.map((name) => ({
                        name,
                        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    }));
                    await Category.insertMany(seedDocs);
                    dbCategories = await Category.find().sort({ name: 1 }).lean();
                }

                const categoriesList: CategoryData[] = dbCategories.map((c) => ({
                    id: c._id.toString(),
                    name: c.name,
                    slug: c.slug,
                }));

                return {
                    success: true,
                    categories: categoriesList,
                };
            } catch (error: any) {
                console.error("Error fetching categories:", error);
                return {
                    success: false,
                    categories: [],
                    error: error.message,
                };
            }
        },
        ["categories-list-cache"],
        { tags: ["categories"], revalidate: 3600 }
    );

    const result = await cachedFetch();

    // Convert Mongoose structures or plain structures to ensure Next.js serialization compatibility
    return JSON.parse(JSON.stringify(result));
}
