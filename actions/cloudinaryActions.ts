"use server";

import crypto from "crypto";

export interface CloudinarySignatureResponse {
    signed: boolean;
    cloudName: string;
    apiKey?: string;
    timestamp?: string;
    signature?: string;
    uploadPreset?: string;
}

/**
 * Generate a lightweight (<1KB) SHA1 signed upload signature for direct browser-to-Cloudinary uploading.
 * Bypasses Vercel Serverless Function payload limits & cold start delays completely!
 */
export async function getCloudinarySignatureAction(): Promise<CloudinarySignatureResponse> {
    try {
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "jhofobjt";
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;
        const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "photography_portfolio";

        if (!apiKey || !apiSecret) {
            return {
                signed: false,
                cloudName,
                uploadPreset,
            };
        }

        const timestamp = Math.floor(Date.now() / 1000).toString();
        const strToSign = `timestamp=${timestamp}${apiSecret}`;
        const signature = crypto.createHash("sha1").update(strToSign).digest("hex");

        return {
            signed: true,
            cloudName,
            apiKey,
            timestamp,
            signature,
        };
    } catch (error: any) {
        console.error("Error generating Cloudinary signature:", error);
        return {
            signed: false,
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "jhofobjt",
            uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "photography_portfolio",
        };
    }
}
