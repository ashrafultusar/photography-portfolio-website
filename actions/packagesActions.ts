"use server";

import { connectDB } from "@/db/dbConfig";
import PackagesPage from "@/models/PackagesPage";
import { revalidatePath, revalidateTag } from "next/cache";
import {
    PackagesHeroData,
    PricingSectionData,
    AddOnsSectionData,
} from "@/lib/types/packages";

// ---------- helpers ----------
async function getOrCreateDoc() {
    await connectDB();
    let doc = await PackagesPage.findOne();
    if (!doc) doc = await PackagesPage.create({});
    return doc;
}

const revalidatePackagesCache = () => {
    try {
        (revalidateTag as any)("packages");
    } catch (e) {
        console.error("revalidateTag error:", e);
    }
    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/packages");
    revalidatePath("/my-dashboard/packages");
};

// ---------- GET ----------
export async function getPackagesPageAction() {
    try {
        const { getPackagesPageData } = await import("@/lib/data/packagesData");
        return await getPackagesPageData();
    } catch (error) {
        console.error("Error in getPackagesPageAction:", error);
        const { FALLBACK_PACKAGES_DATA } = await import("@/lib/data/packagesData");
        return FALLBACK_PACKAGES_DATA;
    }
}

// ---------- SECTION 1: Hero ----------
export async function updatePackagesHeroSection(data: PackagesHeroData) {
    try {
        const doc = await getOrCreateDoc();
        doc.heroSection = {
            eyebrow: data.eyebrow,
            heading: data.heading,
            subtext: data.subtext,
            bgImage: data.bgImage,
        };
        await doc.save();

        revalidatePackagesCache();

        return { success: true, message: "Hero section saved successfully!" };
    } catch (error: any) {
        console.error("Error saving packages hero section:", error);
        return { success: false, message: error.message || "Failed to save." };
    }
}

// ---------- SECTION 2: Pricing ----------
export async function updatePricingSection(data: PricingSectionData) {
    try {
        const doc = await getOrCreateDoc();
        doc.pricingSection = {
            sectionEyebrow: data.sectionEyebrow,
            sectionHeading: data.sectionHeading,
            sectionHeadingAccent: data.sectionHeadingAccent,
            sectionDesc: data.sectionDesc,
            noteText: data.noteText,
            packages: data.packages.map((p) => ({
                name: p.name,
                tagline: p.tagline,
                price: p.price,
                unit: p.unit,
                featured: p.featured,
                features: p.features,
            })),
        };
        await doc.save();

        revalidatePackagesCache();

        return { success: true, message: "Pricing section saved successfully!" };
    } catch (error: any) {
        console.error("Error saving pricing section:", error);
        return { success: false, message: error.message || "Failed to save." };
    }
}

// ---------- SECTION 3: Add-Ons ----------
export async function updateAddOnsSection(data: AddOnsSectionData) {
    try {
        const doc = await getOrCreateDoc();
        doc.addOnsSection = {
            sectionEyebrow: data.sectionEyebrow,
            sectionHeading: data.sectionHeading,
            sectionDesc: data.sectionDesc,
            ctaNote: data.ctaNote,
            addOns: data.addOns.map((a) => ({
                icon: a.icon,
                title: a.title,
                desc: a.desc,
                price: a.price,
            })),
        };
        await doc.save();

        revalidatePackagesCache();

        return { success: true, message: "Add-Ons section saved successfully!" };
    } catch (error: any) {
        console.error("Error saving add-ons section:", error);
        return { success: false, message: error.message || "Failed to save." };
    }
}
