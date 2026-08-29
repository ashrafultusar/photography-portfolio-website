"use server";

import { connectDB } from "@/db/dbConfig";
import Testimonial from "@/models/Testimonial";
import { TestimonialItem } from "@/lib/types/testimonial";
import { revalidatePath, revalidateTag } from "next/cache";

const revalidateTestimonialsCache = () => {
    try {
        (revalidateTag as any)("testimonials");
    } catch (e) {
        console.error("revalidateTag error:", e);
    }
    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/my-dashboard/testimonials");
};

/**
 * Fetch uncached testimonials for admin dashboard
 */
export async function getTestimonialsContentAction() {
    try {
        const { getAdminTestimonials } = await import("@/lib/data/testimonialData");
        return await getAdminTestimonials();
    } catch (error) {
        console.error("Error in getTestimonialsContentAction:", error);
        return [];
    }
}

/**
 * Create a new Testimonial item
 */
export async function createTestimonialAction(data: Omit<TestimonialItem, "_id">) {
    try {
        await connectDB();

        const count = await Testimonial.countDocuments();
        const newItem = await Testimonial.create({
            name: data.name,
            role: data.role || "Happy Client",
            image: data.image || "/hero/1.jpg",
            rating: Number(data.rating) || 5,
            comment: data.comment,
            order: data.order ?? count + 1,
            isActive: data.isActive ?? true,
        });

        revalidateTestimonialsCache();

        return {
            success: true,
            message: "Testimonial created successfully!",
            item: JSON.parse(JSON.stringify(newItem)),
        };
    } catch (error: any) {
        console.error("Error creating testimonial:", error);
        return {
            success: false,
            message: error.message || "Failed to create testimonial.",
        };
    }
}

/**
 * Update an existing Testimonial item
 */
export async function updateTestimonialAction(id: string, data: Partial<TestimonialItem>) {
    try {
        await connectDB();
        const item = await Testimonial.findById(id);

        if (!item) {
            return { success: false, message: "Testimonial not found." };
        }

        if (data.name !== undefined) item.name = data.name;
        if (data.role !== undefined) item.role = data.role;
        if (data.image !== undefined) item.image = data.image;
        if (data.rating !== undefined) item.rating = Number(data.rating);
        if (data.comment !== undefined) item.comment = data.comment;
        if (data.order !== undefined) item.order = Number(data.order);
        if (data.isActive !== undefined) item.isActive = data.isActive;

        await item.save();
        revalidateTestimonialsCache();

        return {
            success: true,
            message: "Testimonial updated successfully!",
            item: JSON.parse(JSON.stringify(item)),
        };
    } catch (error: any) {
        console.error("Error updating testimonial:", error);
        return {
            success: false,
            message: error.message || "Failed to update testimonial.",
        };
    }
}

/**
 * Delete a Testimonial item
 */
export async function deleteTestimonialAction(id: string) {
    try {
        await connectDB();
        await Testimonial.findByIdAndDelete(id);

        revalidateTestimonialsCache();

        return {
            success: true,
            message: "Testimonial deleted successfully!",
        };
    } catch (error: any) {
        console.error("Error deleting testimonial:", error);
        return {
            success: false,
            message: error.message || "Failed to delete testimonial.",
        };
    }
}

/**
 * Reorder Testimonials array in DB
 */
export async function reorderTestimonialsAction(items: TestimonialItem[]) {
    try {
        await connectDB();

        for (let i = 0; i < items.length; i++) {
            if (items[i]._id) {
                await Testimonial.findByIdAndUpdate(items[i]._id, { order: i + 1 });
            }
        }

        revalidateTestimonialsCache();

        return {
            success: true,
            message: "Testimonials reordered successfully!",
        };
    } catch (error: any) {
        console.error("Error reordering testimonials:", error);
        return {
            success: false,
            message: error.message || "Failed to reorder testimonials.",
        };
    }
}
