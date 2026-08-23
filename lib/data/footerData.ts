import { connectDB } from "@/db/dbConfig";
import Footer from "@/models/Footer";
import { FooterData } from "@/lib/types/footer";
import { unstable_cache } from "next/cache";

const FALLBACK_FOOTER: FooterData = {
    logoUrl: "/logo.jpeg",
    brandName: "Moment that matters",
    brandLogoText: "MTM",
    bio: "Capturing your eternal moments and preserving your wedding stories with cinematic elegance and professional photography.",
    location: "Dhaka, Bangladesh",
    phone: "+880 1234-567890",
    email: "info@shondhikkhon.com",
    facebookUrl: "https://facebook.com",
    instagramUrl: "https://instagram.com",
    youtubeUrl: "https://youtube.com",
    whatsappNumber: "+8801700000000",
    copyrightText: "Moment that matters. All rights reserved.",
    quickLinks: [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about" },
        { name: "Portfolio", href: "/portfolio" },
        { name: "Packages", href: "/packages" },
        { name: "Book Us", href: "/contact" },
    ],
};

/**
 * GET Footer & Brand settings from MongoDB (cached)
 */
import { cache } from "react";

const fetchFooterDataFromDB = async (): Promise<FooterData> => {
    try {
        await connectDB();
        const footerPromise = Footer.findOne().lean();
        const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 800));
        const footer: any = await Promise.race([footerPromise, timeoutPromise]);

        if (footer) {
            return {
                logoUrl: footer.logoUrl || FALLBACK_FOOTER.logoUrl,
                brandName: footer.brandName || FALLBACK_FOOTER.brandName,
                brandLogoText: footer.brandLogoText || FALLBACK_FOOTER.brandLogoText,
                bio: footer.bio || FALLBACK_FOOTER.bio,
                location: footer.location || FALLBACK_FOOTER.location,
                phone: footer.phone || FALLBACK_FOOTER.phone,
                email: footer.email || FALLBACK_FOOTER.email,
                facebookUrl: footer.facebookUrl || FALLBACK_FOOTER.facebookUrl,
                instagramUrl: footer.instagramUrl || FALLBACK_FOOTER.instagramUrl,
                youtubeUrl: footer.youtubeUrl || FALLBACK_FOOTER.youtubeUrl,
                whatsappNumber: footer.whatsappNumber || FALLBACK_FOOTER.whatsappNumber,
                copyrightText: footer.copyrightText || FALLBACK_FOOTER.copyrightText,
                quickLinks:
                    footer.quickLinks && footer.quickLinks.length > 0
                        ? footer.quickLinks.map((item: any) => ({
                            name: item.name,
                            href: item.href,
                        }))
                        : FALLBACK_FOOTER.quickLinks,
            };
        }
    } catch (error) {
        console.error("Error fetching Footer data:", error);
    }

    return FALLBACK_FOOTER;
};

export const getFooterData = cache(
    unstable_cache(
        fetchFooterDataFromDB,
        ["footer-data-cache"],
        { tags: ["footer"], revalidate: 3600 }
    )
);

