"use server";

import { connectDB } from "@/db/dbConfig";
import AboutPage from "@/models/AboutPage";
import { revalidatePath, revalidateTag } from "next/cache";
import {
    HomeAboutData,
    AboutHeroData,
    CompanyStoryData,
    TeamSectionData,
    StatsSectionData,
    WhyChooseUsData,
} from "@/lib/types/about";

async function getOrCreateDoc() {
    await connectDB();
    let doc = await AboutPage.findOne();
    if (!doc) doc = await AboutPage.create({});
    return doc;
}

export async function getAboutPageAction() {
    try {
        const { getAboutPageData } = await import("@/lib/data/aboutData");
        return await getAboutPageData();
    } catch (error) {
        console.error("Error in getAboutPageAction:", error);
        const { FALLBACK_ABOUT_DATA } = await import("@/lib/data/aboutData");
        return FALLBACK_ABOUT_DATA;
    }
}

const revalidateAboutCache = () => {
    try {
        (revalidateTag as any)("about");
    } catch (e) {
        console.error("revalidateTag error:", e);
    }
    revalidatePath("/", "layout");
    revalidatePath("/about");
    revalidatePath("/my-dashboard/about");
};

// ── Section 0: Homepage About ──
export async function updateHomeAboutSection(data: HomeAboutData) {
    try {
        await connectDB();
        const homeSectionPayload = {
            eyebrow: data.eyebrow || "",
            heading: data.heading || "",
            description1: data.description1 || "",
            description2: data.description2 || "",
            sinceYear: data.sinceYear || "",
            image1: data.image1 || "",
            image2: data.image2 || "",
            stats: (data.stats || []).map((s) => ({
                icon: s.icon || "camera",
                value: s.value || "",
                label: s.label || "",
            })),
            ctaText: data.ctaText || "",
            ctaLink: data.ctaLink || "",
        };

        await AboutPage.findOneAndUpdate(
            {},
            { $set: { homeSection: homeSectionPayload } },
            { upsert: true, new: true }
        );

        revalidateAboutCache();
        return { success: true, message: "Homepage About section saved successfully!" };
    } catch (error: any) {
        console.error("Error updating home section:", error);
        return { success: false, message: error.message || "Failed to save." };
    }
}


// ── Section 1: Hero ──
export async function updateAboutHeroSection(data: AboutHeroData) {
    try {
        const doc = await getOrCreateDoc();
        doc.heroSection = { eyebrow: data.eyebrow, heading: data.heading, subtext: data.subtext, bgImage: data.bgImage };
        await doc.save();
        revalidateAboutCache();
        return { success: true, message: "Hero section saved!" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to save." };
    }
}

// ── Section 2: Company Story ──
export async function updateCompanyStory(data: CompanyStoryData) {
    try {
        const doc = await getOrCreateDoc();
        doc.companyStory = {
            eyebrow: data.eyebrow,
            heading: data.heading,
            image: data.image,
            items: data.items.map((i) => ({ label: i.label, text: i.text })),
        };
        await doc.save();
        revalidateAboutCache();
        return { success: true, message: "Company Story saved!" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to save." };
    }
}

// ── Section 3: Team ──
export async function updateTeamSection(data: TeamSectionData) {
    try {
        const doc = await getOrCreateDoc();
        doc.teamSection = {
            eyebrow: data.eyebrow,
            heading: data.heading,
            members: data.members.map((m) => ({ name: m.name, role: m.role, image: m.image, bio: m.bio })),
        };
        await doc.save();
        revalidateAboutCache();
        return { success: true, message: "Team section saved!" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to save." };
    }
}

// ── Section 4: Stats ──
export async function updateStatsSection(data: StatsSectionData) {
    try {
        const doc = await getOrCreateDoc();
        doc.statsSection = {
            eyebrow: data.eyebrow,
            heading: data.heading,
            stats: data.stats.map((s) => ({ value: s.value, suffix: s.suffix, label: s.label })),
        };
        await doc.save();
        revalidateAboutCache();
        return { success: true, message: "Stats section saved!" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to save." };
    }
}

// ── Section 5: Why Choose Us ──
export async function updateWhyChooseUs(data: WhyChooseUsData) {
    try {
        const doc = await getOrCreateDoc();
        doc.whyChooseUs = {
            eyebrow: data.eyebrow,
            heading: data.heading,
            items: data.items.map((i) => ({ icon: i.icon, title: i.title, desc: i.desc })),
        };
        await doc.save();
        revalidateAboutCache();
        return { success: true, message: "Why Choose Us saved!" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to save." };
    }
}
