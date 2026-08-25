"use server";

import { connectDB } from "@/db/dbConfig";
import Category from "@/models/Category";
import { CategoryData } from "@/lib/types/portfolio";
import { unstable_cache } from "next/cache";
import { cache } from "react";

const fetchCategoryNamesFromDB = async (): Promise<string[]> => {
    try {
        await connectDB();
        const categories: any = await Category.find().sort({ name: 1 }).lean();

        if (categories && Array.isArray(categories)) {
            return categories.map((c) => c.name);
        }
        return [];
    } catch (error) {
        console.error("Error fetching category names:", error);
        return [];
    }
};

/**
 * GET Category names list from DB (two-tier cached)
 */
export const getCategoryNames = cache(
    unstable_cache(
        fetchCategoryNamesFromDB,
        ["category-names-cache"],
        { tags: ["categories"], revalidate: 3600 }
    )
);

const fetchCategoriesFromDB = async (): Promise<{ success: boolean; categories: CategoryData[]; error?: string }> => {
    try {
        await connectDB();
        const dbCategories: any = await Category.find().sort({ name: 1 }).lean();

        if (dbCategories && Array.isArray(dbCategories)) {
            const categoriesList: CategoryData[] = dbCategories.map((c) => ({
                id: c._id.toString(),
                name: c.name,
                slug: c.slug,
            }));

            return {
                success: true,
                categories: categoriesList,
            };
        }

        return { success: true, categories: [] };
    } catch (error: any) {
        console.error("Error fetching categories:", error);
        return {
            success: false,
            categories: [],
            error: error.message,
        };
    }
};

/**
 * GET All Category records from DB (two-tier cached)
 */
const cachedGetCategories = cache(
    unstable_cache(
        fetchCategoriesFromDB,
        ["categories-list-cache"],
        { tags: ["categories"], revalidate: 3600 }
    )
);

export async function getCategories(): Promise<{ success: boolean; categories: CategoryData[]; error?: string }> {
    const result = await cachedGetCategories();
    return JSON.parse(JSON.stringify(result));
}

