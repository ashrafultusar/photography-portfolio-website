"use server";

import { connectDB } from "@/db/dbConfig";
import Portfolio, { IPortfolioAlbum } from "@/models/Portfolio";
import { revalidatePath, revalidateTag } from "next/cache";
import crypto from "crypto";

export interface AlbumInputData {
    title: string;
    category: string;
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

        const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "jhofobjt";
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;
        const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "photography_portfolio";

        const uploadedUrls: string[] = [];

        for (const file of filesToUpload) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const base64Image = `data:${file.type || "image/jpeg"};base64,${buffer.toString("base64")}`;

            if (cloudName) {
                const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
                let res: Response;

                if (apiKey && apiSecret) {
                    // Signed Cloudinary upload using API Key & API Secret
                    const timestamp = Math.floor(Date.now() / 1000).toString();
                    const strToSign = `timestamp=${timestamp}${apiSecret}`;
                    const signature = crypto.createHash("sha1").update(strToSign).digest("hex");

                    const bodyData = new URLSearchParams();
                    bodyData.append("file", base64Image);
                    bodyData.append("api_key", apiKey);
                    bodyData.append("timestamp", timestamp);
                    bodyData.append("signature", signature);

                    res = await fetch(cloudinaryUrl, {
                        method: "POST",
                        body: bodyData,
                    });
                } else {
                    // Unsigned preset fallback
                    const bodyData = new URLSearchParams();
                    bodyData.append("file", base64Image);
                    bodyData.append("upload_preset", uploadPreset);

                    res = await fetch(cloudinaryUrl, {
                        method: "POST",
                        body: bodyData,
                    });
                }

                if (res.ok) {
                    const data = await res.json();
                    uploadedUrls.push(data.secure_url);
                } else {
                    const errJson = await res.json().catch(() => ({}));
                    console.warn("Cloudinary upload API status non-OK:", errJson);
                    uploadedUrls.push(base64Image);
                }
            } else {
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
        // Include `images` for photoCount computation while keeping payload lightweight
        const albums = await Portfolio.find()
            .select("title slug category clientName eventDate location coverImage description featured images")
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
                photoCount: a.images?.length || 0,
                description: a.description || "",
                featured: a.featured || false,
                images: a.images || [],
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

export async function updatePortfolioAlbum(id: string, data: AlbumInputData) {
    try {
        await connectDB();
        const updated = await Portfolio.findByIdAndUpdate(
            id,
            {
                title: data.title,
                category: data.category,
                clientName: data.clientName,
                eventDate: data.eventDate,
                location: data.location,
                description: data.description,
                coverImage: data.coverImage,
                images: data.images,
                featured: data.featured,
            },
            { new: true }
        );

        (revalidateTag as any)("portfolio");
        revalidatePath("/portfolio");
        revalidatePath("/");
        revalidatePath("/my-dashboard/portfolio");

        return {
            success: true,
            message: "Portfolio album updated successfully!",
            album: updated ? { ...updated.toObject(), _id: updated._id.toString() } : null,
        };
    } catch (error: any) {
        console.error("Update portfolio album error:", error);
        return {
            success: false,
            message: error.message || "Failed to update portfolio album.",
        };
    }
}

export async function getPortfolioAlbumByIdAction(id: string) {
    try {
        await connectDB();
        const album = await Portfolio.findById(id).lean();
        if (!album) return { success: false, message: "Album not found" };

        return {
            success: true,
            album: {
                ...album,
                _id: (album as any)._id?.toString(),
                images: (album as any).images || [],
            },
        };
    } catch (error: any) {
        console.error("Get portfolio album by ID error:", error);
        return { success: false, message: error.message || "Failed to fetch album details." };
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
