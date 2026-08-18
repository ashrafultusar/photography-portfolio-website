/**
 * Compress an image File in the browser using HTML5 Canvas
 * Resizes large photos to a max dimension while maintaining aspect ratio and quality
 */
export async function compressImage(file: File, maxWidth = 2500, quality = 0.85): Promise<Blob> {
    if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") {
        return file; // Return original if not static image
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
                        resolve(file); // Return original if compression didn't reduce size
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
 * Direct Client-Side Upload to Cloudinary API with parallel batch processing
 * Bypasses Next.js / Vercel 4.5MB Server Action payload limit completely!
 */
export async function uploadImagesDirectToCloudinary(
    files: File[],
    onProgress?: (completed: number, total: number) => void
): Promise<{ success: boolean; urls: string[]; errors: string[] }> {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dqmsedms8"; // Fallback cloud name if configured
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "photography_portfolio";

    const urls: string[] = [];
    const errors: string[] = [];
    let completedCount = 0;

    // Parallel upload batching (3 files at a time)
    const BATCH_SIZE = 4;
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
        const batch = files.slice(i, i + BATCH_SIZE);
        const batchPromises = batch.map(async (file) => {
            try {
                // Step 1: Compress image on client
                const compressedBlob = await compressImage(file);
                const fileToUpload = new File([compressedBlob], file.name, { type: "image/jpeg" });

                // Step 2: Upload directly from browser to Cloudinary CDN
                const formData = new FormData();
                formData.append("file", fileToUpload);
                formData.append("upload_preset", uploadPreset);

                const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
                const response = await fetch(endpoint, {
                    method: "POST",
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.secure_url) {
                        return { success: true, url: data.secure_url };
                    }
                }

                // Fallback to Server Action if unsigned upload preset fails
                const fd = new FormData();
                fd.append("file", file);
                const { uploadToCloudinary } = await import("@/actions/portfolioActions");
                const res = await uploadToCloudinary(fd);
                if (res.success && res.urls && res.urls[0]) {
                    return { success: true, url: res.urls[0] };
                }

                return { success: false, error: `Failed to upload ${file.name}` };
            } catch (err: any) {
                return { success: false, error: err.message || `Upload failed for ${file.name}` };
            }
        });

        const results = await Promise.all(batchPromises);
        results.forEach((res) => {
            completedCount++;
            if (res.success && res.url) {
                urls.push(res.url);
            } else if (res.error) {
                errors.push(res.error);
            }
        });

        if (onProgress) {
            onProgress(completedCount, files.length);
        }
    }

    return {
        success: urls.length > 0,
        urls,
        errors,
    };
}
