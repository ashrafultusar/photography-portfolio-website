import { connectDB } from "@/db/dbConfig";
import PackagesPage from "@/models/PackagesPage";
import { PackagesPageData } from "@/lib/types/packages";
import { unstable_cache } from "next/cache";

export const FALLBACK_PACKAGES_DATA: PackagesPageData = {
    heroSection: {
        eyebrow: "Pricing",
        heading: "Our Packages",
        subtext: "Transparent pricing crafted to suit every couple's dream day.",
        bgImage: "/hero/4.jpg",
    },
    pricingSection: {
        sectionEyebrow: "Investment",
        sectionHeading: "Choose Your",
        sectionHeadingAccent: "Story",
        sectionDesc:
            "Every package includes full post-processing, private online gallery, and a dedicated story editor.",
        noteText: "Need something custom? Let's talk.",
        packages: [
            {
                name: "Silver",
                tagline: "Perfect for intimate moments",
                price: "৳ 25,000",
                unit: "per event",
                featured: false,
                features: [
                    "6 Hours Coverage",
                    "200+ Edited Photos",
                    "Online Gallery",
                    "1 Photographer",
                    "Basic Highlight Reel",
                ],
            },
            {
                name: "Gold",
                tagline: "Our most loved package",
                price: "৳ 45,000",
                unit: "per event",
                featured: true,
                features: [
                    "Full Day Coverage",
                    "400+ Edited Photos",
                    "Cinematic Highlight Video",
                    "2 Photographers",
                    "Luxury Printed Album",
                    "Online Gallery (1 Year)",
                ],
            },
            {
                name: "Platinum",
                tagline: "The complete experience",
                price: "৳ 75,000",
                unit: "per event",
                featured: false,
                features: [
                    "2-Day Full Coverage",
                    "600+ Edited Photos",
                    "Full Wedding Film",
                    "3 Photographers",
                    "Luxury Heirloom Album",
                    "Drone Aerial Shots",
                    "Same-Day Preview",
                ],
            },
        ],
    },
    addOnsSection: {
        sectionEyebrow: "Customize",
        sectionHeading: "Enhance Your Experience",
        sectionDesc:
            "Add-Ons — Customize your package with these premium additions.",
        ctaNote:
            "Mention your desired add-ons when booking and we'll tailor the perfect package for you.",
        addOns: [
            {
                icon: "zap",
                title: "Express Delivery",
                desc: "Delivery within 7 days",
                price: "৳10,000",
            },
            {
                icon: "wind",
                title: "Drone Coverage",
                desc: "Aerial shots, 5 hours",
                price: "৳25,000",
            },
            {
                icon: "clapperboard",
                title: "4K Quality",
                desc: "Upgraded 4K footage",
                price: "৳25,000",
            },
            {
                icon: "camera",
                title: "Pre-Shoot",
                desc: "1 Photographer + 1 Videographer, 1 Hour",
                price: "৳20,000",
            },
        ],
    },
};

import { cache } from "react";

const fetchPackagesPageDataFromDB = async (): Promise<PackagesPageData> => {
    try {
        await connectDB();
        const docPromise = PackagesPage.findOne()
            .select("heroSection pricingSection addOnsSection")
            .lean();

        const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 800));
        const doc: any = await Promise.race([docPromise, timeoutPromise]);

        if (doc) {
            return {
                heroSection: {
                    eyebrow: doc.heroSection?.eyebrow || FALLBACK_PACKAGES_DATA.heroSection.eyebrow,
                    heading: doc.heroSection?.heading || FALLBACK_PACKAGES_DATA.heroSection.heading,
                    subtext: doc.heroSection?.subtext || FALLBACK_PACKAGES_DATA.heroSection.subtext,
                    bgImage: doc.heroSection?.bgImage || FALLBACK_PACKAGES_DATA.heroSection.bgImage,
                },
                pricingSection: {
                    sectionEyebrow: doc.pricingSection?.sectionEyebrow || FALLBACK_PACKAGES_DATA.pricingSection.sectionEyebrow,
                    sectionHeading: doc.pricingSection?.sectionHeading || FALLBACK_PACKAGES_DATA.pricingSection.sectionHeading,
                    sectionHeadingAccent: doc.pricingSection?.sectionHeadingAccent || FALLBACK_PACKAGES_DATA.pricingSection.sectionHeadingAccent,
                    sectionDesc: doc.pricingSection?.sectionDesc || FALLBACK_PACKAGES_DATA.pricingSection.sectionDesc,
                    noteText: doc.pricingSection?.noteText || FALLBACK_PACKAGES_DATA.pricingSection.noteText,
                    packages:
                        doc.pricingSection?.packages?.length > 0
                            ? doc.pricingSection.packages.map((p: any) => ({
                                name: p.name,
                                tagline: p.tagline || "",
                                price: p.price,
                                unit: p.unit || "per event",
                                featured: p.featured || false,
                                features: p.features || [],
                            }))
                            : FALLBACK_PACKAGES_DATA.pricingSection.packages,
                },
                addOnsSection: {
                    sectionEyebrow: doc.addOnsSection?.sectionEyebrow || FALLBACK_PACKAGES_DATA.addOnsSection.sectionEyebrow,
                    sectionHeading: doc.addOnsSection?.sectionHeading || FALLBACK_PACKAGES_DATA.addOnsSection.sectionHeading,
                    sectionDesc: doc.addOnsSection?.sectionDesc || FALLBACK_PACKAGES_DATA.addOnsSection.sectionDesc,
                    ctaNote: doc.addOnsSection?.ctaNote || FALLBACK_PACKAGES_DATA.addOnsSection.ctaNote,
                    addOns:
                        doc.addOnsSection?.addOns?.length > 0
                            ? doc.addOnsSection.addOns.map((a: any) => ({
                                icon: a.icon || "star",
                                title: a.title,
                                desc: a.desc || "",
                                price: a.price,
                            }))
                            : FALLBACK_PACKAGES_DATA.addOnsSection.addOns,
                },
            };
        }
    } catch (error) {
        console.error("Error fetching PackagesPage data:", error);
    }

    return FALLBACK_PACKAGES_DATA;
};

export const getPackagesPageData = cache(
    unstable_cache(
        fetchPackagesPageDataFromDB,
        ["packages-page-cache"],
        { tags: ["packages"], revalidate: 3600 }
    )
);
