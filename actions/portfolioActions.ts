"use server";

import { connectDB } from "@/db/dbConfig";
import Portfolio, { IPortfolioAlbum } from "@/models/Portfolio";
import { revalidatePath, revalidateTag } from "next/cache";

export interface AlbumInputData {
    title: string;
    category: "Wedding" | "Holud" | "Nikah" | "Reception" | "Pre-Wedding" | "Engagement" | "Portrait" | "Event" | "Commercial";
    clientName: string;
    eventDate: string;
    location: string;
    description: string;
    coverImage: string;
    images: { src: string; alt: string }[];
    featured: boolean;
}

// ─── Cloudinary Upload Server Action ─────────────────────────────────────────

export async function uploadToCloudinary(formData: FormData): Promise<{ success: boolean; urls?: string[]; error?: string }> {
    try {
        const files = formData.getAll("files") as File[];
        const singleFile = formData.get("file") as File | null;

        const filesToUpload: File[] = [];
        if (files && files.length > 0 && files[0].name) {
            filesToUpload.push(...files);
        } else if (singleFile && singleFile.name) {
            filesToUpload.push(singleFile);
        }

        if (filesToUpload.length === 0) {
            return { success: false, error: "No files provided for upload." };
        }

        const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "photography_portfolio";

        const uploadedUrls: string[] = [];

        for (const file of filesToUpload) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const base64Image = `data:${file.type || "image/jpeg"};base64,${buffer.toString("base64")}`;

            if (cloudName) {
                // Upload to Cloudinary API
                const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

                const bodyData = new URLSearchParams();
                bodyData.append("file", base64Image);
                bodyData.append("upload_preset", uploadPreset);

                const res = await fetch(cloudinaryUrl, {
                    method: "POST",
                    body: bodyData,
                });

                if (res.ok) {
                    const data = await res.json();
                    uploadedUrls.push(data.secure_url);
                } else {
                    // If unsigned preset fails, fallback to returning data URL or error log
                    console.warn("Cloudinary upload API returned non-OK status. Falling back to data URL.");
                    uploadedUrls.push(base64Image);
                }
            } else {
                // Fallback when Cloudinary environment variables are not set
                uploadedUrls.push(base64Image);
            }
        }

        return {
            success: true,
            urls: uploadedUrls,
        };
    } catch (error: any) {
        console.error("Error uploading to Cloudinary:", error);
        return { success: false, error: error.message || "Cloudinary upload failed." };
    }
}

// ─── Album CRUD Server Actions ───────────────────────────────────────────────

export async function createPortfolioAlbum(data: AlbumInputData) {
    try {
        await connectDB();

        let baseSlug = data.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        if (!baseSlug) {
            baseSlug = `album-${Date.now()}`;
        }

        let slug = baseSlug;
        let count = 1;
        while (await Portfolio.findOne({ slug })) {
            slug = `${baseSlug}-${count}`;
            count++;
        }

        const newAlbum = await Portfolio.create({
            title: data.title,
            slug,
            category: data.category,
            clientName: data.clientName,
            eventDate: data.eventDate,
            location: data.location,
            description: data.description,
            coverImage: data.coverImage,
            images: data.images,
            featured: data.featured,
        });

        (revalidateTag as any)("portfolio");
        revalidatePath("/portfolio");
        revalidatePath("/");
        revalidatePath("/my-dashboard/portfolio");

        return {
            success: true,
            message: "Portfolio album created successfully!",
            album: { ...newAlbum.toObject(), _id: newAlbum._id.toString() },
        };
    } catch (error: any) {
        console.error("Create portfolio album error:", error);
        return {
            success: false,
            message: error.message || "Failed to create portfolio album.",
        };
    }
}

export async function getPortfolioAlbums() {
    try {
        await connectDB();
        // Exclude heavy `images` array from list view to keep initial load instantaneous (< 100ms)
        const albums = await Portfolio.find()
            .select("title slug category clientName eventDate location coverImage description featured")
            .sort({ createdAt: -1 })
            .lean();

        return {
            success: true,
            albums: albums.map((a: any) => ({
                id: a._id?.toString() || a.id || "",
                slug: a.slug,
                title: a.title,
                category: a.category,
                clientName: a.clientName || "",
                eventDate: a.eventDate || "",
                location: a.location || "",
                coverImage: a.coverImage || "",
                photoCount: 0,
                description: a.description || "",
                featured: a.featured || false,
                images: [],
            })),
        };
    } catch (error: any) {
        console.error("Get portfolio albums error:", error);
        return {
            success: false,
            albums: [],
            error: error.message,
        };
    }
}

export async function deletePortfolioAlbum(id: string) {
    try {
        await connectDB();
        await Portfolio.findByIdAndDelete(id);

        (revalidateTag as any)("portfolio");
        revalidatePath("/portfolio");
        revalidatePath("/");
        revalidatePath("/my-dashboard/portfolio");

        return {
            success: true,
            message: "Album deleted successfully.",
        };
    } catch (error: any) {
        console.error("Delete portfolio album error:", error);
        return {
            success: false,
            message: error.message || "Failed to delete album.",
        };
    }
}
