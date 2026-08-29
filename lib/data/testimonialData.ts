import { connectDB } from "@/db/dbConfig";
import Testimonial from "@/models/Testimonial";
import { TestimonialItem } from "@/lib/types/testimonial";
import { unstable_cache } from "next/cache";
import { cache } from "react";

const fetchTestimonialsFromDB = async (): Promise<TestimonialItem[]> => {
    try {
        await connectDB();
        const items = await Testimonial.find({ isActive: true })
            .sort({ order: 1, createdAt: -1 })
            .lean();

        if (items && items.length > 0) {
            return items.map((item: any) => ({
                _id: item._id.toString(),
                name: item.name,
                role: item.role || "Happy Client",
                image: item.image || "/hero/1.jpg",
                rating: item.rating || 5,
                comment: item.comment,
                order: item.order || 0,
                isActive: item.isActive ?? true,
            }));
        }
    } catch (error) {
        console.error("Error fetching testimonials data:", error);
    }

    return [];
};

/**
 * Two-tier cached GET Testimonials content (React cache + Next.js unstable_cache)
 */
export const getTestimonials = cache(
    unstable_cache(
        fetchTestimonialsFromDB,
        ["testimonials-cache"],
        { tags: ["testimonials"], revalidate: 3600 }
    )
);

/**
 * GET uncached Testimonials directly from MongoDB for Admin Dashboard
 */
export async function getAdminTestimonials(): Promise<TestimonialItem[]> {
    try {
        await connectDB();
        const items = await Testimonial.find({})
            .sort({ order: 1, createdAt: -1 })
            .lean();

        if (items && items.length > 0) {
            return items.map((item: any) => ({
                _id: item._id.toString(),
                name: item.name,
                role: item.role || "Happy Client",
                image: item.image || "/hero/1.jpg",
                rating: item.rating || 5,
                comment: item.comment,
                order: item.order || 0,
                isActive: item.isActive ?? true,
                createdAt: item.createdAt ? item.createdAt.toISOString() : undefined,
                updatedAt: item.updatedAt ? item.updatedAt.toISOString() : undefined,
            }));
        }
    } catch (error) {
        console.error("Error fetching admin testimonials data:", error);
    }

    return [];
}
