"use server";

import { connectDB } from "@/db/dbConfig";
import Category from "@/models/Category";
import { revalidatePath, revalidateTag } from "next/cache";

export async function createCategory(name: string) {
    try {
        if (!name || !name.trim()) {
            return { success: false, error: "Category name is required." };
        }

        await connectDB();

        const trimmedName = name.trim();
        const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        const existing = await Category.findOne({
            $or: [{ name: trimmedName }, { slug }],
        });

        if (existing) {
            return { success: false, error: "Category already exists." };
        }

        const category = await Category.create({
            name: trimmedName,
            slug,
        });

        (revalidateTag as any)("categories");
        (revalidateTag as any)("portfolio");
        revalidatePath("/portfolio");
        revalidatePath("/");
        revalidatePath("/my-dashboard/portfolio");

        return {
            success: true,
            category: JSON.parse(JSON.stringify(category)),
            message: "Category added successfully!",
        };
    } catch (error: any) {
        console.error("Create category error:", error);
        return { success: false, error: error.message || "Failed to create category." };
    }
}

export async function deleteCategory(id: string) {
    try {
        await connectDB();
        await Category.findByIdAndDelete(id);

        (revalidateTag as any)("categories");
        (revalidateTag as any)("portfolio");
        revalidatePath("/portfolio");
        revalidatePath("/");
        revalidatePath("/my-dashboard/portfolio");

        return { success: true, message: "Category deleted successfully." };
    } catch (error: any) {
        console.error("Delete category error:", error);
        return { success: false, error: error.message || "Failed to delete category." };
    }
}

export async function getCategoryNamesAction(): Promise<string[]> {
    try {
        const { getCategoryNames } = await import("@/lib/data/categoryData");
        return await getCategoryNames();
    } catch (error) {
        console.error("Error in getCategoryNamesAction:", error);
        return [];
    }
}

export async function getCategoriesAction() {
    try {
        const { getCategories } = await import("@/lib/data/categoryData");
        return await getCategories();
    } catch (error) {
        console.error("Error in getCategoriesAction:", error);
        return { success: false, categories: [] };
    }
}

