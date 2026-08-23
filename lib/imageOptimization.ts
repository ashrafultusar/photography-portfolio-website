/**
 * Safely transforms Cloudinary image URLs to serve auto-formatted (WebP/AVIF)
 * and compressed/resized images for high performance public site rendering.
 *
 * Safe for Admin dashboard: Returns local static assets (/hero/1.jpg), blob URLs,
 * and base64 strings completely untouched.
 */
export function getOptimizedImageUrl(
    url: string | null | undefined,
    width = 1200,
    quality = 80
): string {
    if (!url || typeof url !== "string") {
        return "/hero/1.jpg";
    }

    // Safety checks for admin uploads, base64 strings, blob URLs, and local static images
    if (
        url.startsWith("data:image/") ||
        url.startsWith("blob:") ||
        url.startsWith("/") ||
        !url.includes("res.cloudinary.com") ||
        !url.includes("/upload/")
    ) {
        return url;
    }

    // If URL already contains auto formatting parameters, return as is
    if (url.includes("/upload/f_auto,q_auto") || url.includes("/upload/q_auto,f_auto")) {
        return url;
    }

    // Safely inject Cloudinary transformation parameters
    const transformParams = `f_auto,q_auto,w_${width},c_limit`;
    return url.replace("/upload/", `/upload/${transformParams}/`);
}
