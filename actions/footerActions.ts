"use server";

import { connectDB } from "@/db/dbConfig";
import Footer from "@/models/Footer";
import { FooterData } from "@/lib/types/footer";
import { revalidatePath, revalidateTag } from "next/cache";

export async function updateFooterContent(data: FooterData) {
    try {
        await connectDB();

        let footer = await Footer.findOne();

        if (footer) {
            footer.logoUrl = data.logoUrl || "/logo.jpeg";
            footer.brandName = data.brandName;
            footer.brandLogoText = data.brandLogoText;
            footer.bio = data.bio;
            footer.location = data.location;
            footer.phone = data.phone;
            footer.email = data.email;
            footer.facebookUrl = data.facebookUrl;
            footer.instagramUrl = data.instagramUrl;
            footer.youtubeUrl = data.youtubeUrl;
            footer.whatsappNumber = data.whatsappNumber;
            footer.copyrightText = data.copyrightText;
            footer.quickLinks = data.quickLinks;
            await footer.save();
        } else {
            footer = await Footer.create(data);
        }

        (revalidateTag as any)("footer");
        revalidatePath("/", "layout");
        revalidatePath("/my-dashboard/footer");

        return {
            success: true,
            message: "Logo & Footer content updated successfully!",
            footer: JSON.parse(JSON.stringify(footer)),
        };
    } catch (error: any) {
        console.error("Error updating Footer section:", error);
        return {
            success: false,
            message: error.message || "Failed to update Footer section.",
        };
    }
}

export async function getFooterContentAction() {
    try {
        const { getFooterData } = await import("@/lib/data/footerData");
        return await getFooterData();
    } catch (error) {
        console.error("Error in getFooterContentAction:", error);
        return {
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
    }
}
