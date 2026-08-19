import { getCloudinarySignatureAction } from "@/actions/cloudinaryActions";

/**
 * Compress an image File in the browser using HTML5 Canvas
 * Resizes large photos to max dimension (e.g. 2000px) while preserving quality
 */
export async function compressImage(file: File, maxWidth = 2000, quality = 0.82): Promise<Blob> {
    if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") {
        return file;
    }

    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            let { width, height } = img;
            if (width > maxWidth || height > maxWidth) {
                if (width > height) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                } else {
                    width = Math.round((width * maxWidth) / height);
                    height = maxWidth;
                }
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                resolve(file);
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
                (blob) => {
                    if (blob && blob.size < file.size) {
                        resolve(blob);
                    } else {
                        resolve(file);
                    }
                },
                "image/jpeg",
                quality
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve(file);
        };

        img.src = url;
    });
}

/**
 * Direct Client-to-Cloudinary Parallel REST Upload
 * Direct browser HTTP POST -> Cloudinary CDN (Bypasses Vercel serverless 4.5MB limit & cold-starts)
 */
export async function uploadImagesDirectToCloudinary(
    files: File[],
    onProgress?: (completed: number, total: number) => void
): Promise<{ success: boolean; urls: string[]; errors: string[] }> {
    if (!files || files.length === 0) {
        return { success: false, urls: [], errors: ["No files provided"] };
    }

    const urls: string[] = [];
    const errors: string[] = [];
    let completedCount = 0;

    // Step 1: Obtain signature or upload preset configuration once (<30ms server call)
    const sigConfig = await getCloudinarySignatureAction();
    const cloudName = sigConfig.cloudName || "jhofobjt";
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    // Step 2: Upload all files simultaneously in parallel directly from browser to Cloudinary
    const uploadPromises = files.map(async (file) => {
        try {
            // Compress on browser canvas (~50ms)
            const compressedBlob = await compressImage(file, 2000, 0.82);
            const formData = new FormData();
            formData.append("file", compressedBlob, file.name || "photo.jpg");

            if (sigConfig.signed && sigConfig.apiKey && sigConfig.timestamp && sigConfig.signature) {
                formData.append("api_key", sigConfig.apiKey);
                formData.append("timestamp", sigConfig.timestamp);
                formData.append("signature", sigConfig.signature);
            } else {
                formData.append("upload_preset", sigConfig.uploadPreset || "photography_portfolio");
            }

            // Direct fetch directly to Cloudinary API
            const res = await fetch(cloudinaryUrl, {
                method: "POST",
                body: formData,
            });

            completedCount++;
            if (onProgress) {
                onProgress(completedCount, files.length);
            }

            if (res.ok) {
                const data = await res.json();
                return { success: true, url: data.secure_url };
            } else {
                const errData = await res.json().catch(() => ({}));
                console.warn("Direct Cloudinary upload error response:", errData);
                return { success: false, error: errData?.error?.message || `Upload failed for ${file.name}` };
            }
        } catch (err: any) {
            console.error("Direct Cloudinary fetch network error:", err);
            return { success: false, error: err.message || `Network error for ${file.name}` };
        }
    });

    const results = await Promise.all(uploadPromises);
    results.forEach((res) => {
        if (res.success && res.url) {
            urls.push(res.url);
        } else if (res.error) {
            errors.push(res.error);
        }
    });

    return {
        success: urls.length > 0,
        urls,
        errors,
    };
}
