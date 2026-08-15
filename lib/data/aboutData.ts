import { connectDB } from "@/db/dbConfig";
import AboutPage from "@/models/AboutPage";
import { AboutPageData } from "@/lib/types/about";
import { unstable_cache } from "next/cache";

export const FALLBACK_ABOUT_DATA: AboutPageData = {
    homeSection: {
        eyebrow: "Our Story",
        heading: "We Don't Just Take Photos, We Craft Timeless Memories",
        description1: "The Story is Dhaka's premier wedding photography studio, blending cinematic storytelling with authentic emotion. Every shutter click is a promise — to preserve the warmth, joy, and tears that make your day irreplaceable.",
        description2: "From intimate nikahs to grand wedding celebrations, we bring the same obsessive attention to light, composition, and feeling that transforms fleeting moments into heirlooms.",
        sinceYear: "2016",
        image1: "/hero/1.jpg",
        image2: "/hero/2.jpg",
        stats: [
            { icon: "camera", value: "500+", label: "Stories Told" },
            { icon: "heart", value: "8+", label: "Years of Love" },
            { icon: "star", value: "4.9", label: "Client Rating" },
            { icon: "award", value: "12+", label: "Awards Won" },
        ],
        ctaText: "Meet Our Team",
        ctaLink: "/about",
    },
    heroSection: {
        eyebrow: "Our Story",
        heading: "About The Story",
        subtext: "A Dhaka-based wedding photography studio crafting timeless memories since 2018.",
        bgImage: "/hero/3.jpg",
    },
    companyStory: {
        eyebrow: "Who We Are",
        heading: "A Studio Built on\nLove & Light",
        image: "/hero/2.jpg",
        items: [
            {
                label: "Our Beginning",
                text: "The Story was born from a simple belief — that every love story deserves to be told beautifully. Founded in Dhaka, we started as a two-person team with a single camera and an unmatched passion for authentic moments.",
            },
            {
                label: "Our Vision",
                text: "We envision a world where every couple can look back at their wedding day and feel every emotion again — the nervous laughs, the happy tears, the quiet glances. We freeze those fleeting seconds forever.",
            },
            {
                label: "Our Mission",
                text: "To deliver cinematic, emotionally resonant photography and videography that tells your unique story — with artistry, integrity, and heart.",
            },
        ],
    },
    teamSection: {
        eyebrow: "The People",
        heading: "Meet Our Team",
        members: [
            { name: "Rafiq Ahmed", role: "Lead Photographer", image: "/hero/1.jpg", bio: "8 years crafting visual stories across Bangladesh." },
            { name: "Nusrat Jahan", role: "Senior Videographer", image: "/hero/2.jpg", bio: "Cinematic storyteller with a passion for emotion." },
            { name: "Tanvir Hassan", role: "Drone Operator", image: "/hero/3.jpg", bio: "Aerial maestro capturing breathtaking perspectives." },
            { name: "Mitu Akter", role: "Photo Editor", image: "/hero/4.jpg", bio: "Transforms raw frames into timeless memories." },
        ],
    },
    statsSection: {
        eyebrow: "By The Numbers",
        heading: "Our Journey So Far",
        stats: [
            { value: 8, suffix: "+", label: "Years of Experience" },
            { value: 500, suffix: "+", label: "Weddings Covered" },
            { value: 20, suffix: "+", label: "Cities Across BD" },
            { value: 98, suffix: "%", label: "Happy Clients" },
        ],
    },
    whyChooseUs: {
        eyebrow: "Why We're Different",
        heading: "Why Choose The Story",
        items: [
            { icon: "camera", title: "Cinematic Eye", desc: "Every shot is composed with purpose — we don't just take photos, we craft frames." },
            { icon: "film", title: "Film-Quality Video", desc: "Our videos aren't slideshows. They're short films that move you to tears." },
            { icon: "heart", title: "Couple-First Approach", desc: "We melt into the background so you can be truly yourselves on your special day." },
            { icon: "award", title: "Award-Winning Team", desc: "Recognised nationally for wedding photography excellence since 2018." },
            { icon: "clock", title: "On-Time Delivery", desc: "Your memories are delivered on schedule — no endless waiting." },
            { icon: "map-pin", title: "Anywhere in BD", desc: "From Dhaka rooftops to Cox's Bazar beaches — we travel wherever your story is." },
        ],
    },
};

const sanitizeImg = (url: any, fallback: string): string => {
    if (typeof url !== "string" || !url) return fallback;
    if (url.startsWith("data:image/") || url.length > 2000) return fallback;
    return url;
};

export const getAboutPageData = unstable_cache(
    async (): Promise<AboutPageData> => {
        try {
            await connectDB();
            const doc: any = await AboutPage.findOne()
                .select(
                    "homeSection heroSection companyStory teamSection statsSection whyChooseUs"
                )
                .lean();

            if (doc) {
                return {
                    homeSection: {
                        eyebrow: doc.homeSection?.eyebrow ?? FALLBACK_ABOUT_DATA.homeSection.eyebrow,
                        heading: doc.homeSection?.heading ?? FALLBACK_ABOUT_DATA.homeSection.heading,
                        description1: doc.homeSection?.description1 ?? FALLBACK_ABOUT_DATA.homeSection.description1,
                        description2: doc.homeSection?.description2 ?? FALLBACK_ABOUT_DATA.homeSection.description2,
                        sinceYear: doc.homeSection?.sinceYear ?? FALLBACK_ABOUT_DATA.homeSection.sinceYear,
                        image1: sanitizeImg(doc.homeSection?.image1, FALLBACK_ABOUT_DATA.homeSection.image1),
                        image2: sanitizeImg(doc.homeSection?.image2, FALLBACK_ABOUT_DATA.homeSection.image2),
                        stats: doc.homeSection?.stats !== undefined && doc.homeSection?.stats !== null
                            ? doc.homeSection.stats.map((s: any) => ({ icon: s.icon || "camera", value: s.value, label: s.label }))
                            : FALLBACK_ABOUT_DATA.homeSection.stats,
                        ctaText: doc.homeSection?.ctaText ?? FALLBACK_ABOUT_DATA.homeSection.ctaText,
                        ctaLink: doc.homeSection?.ctaLink ?? FALLBACK_ABOUT_DATA.homeSection.ctaLink,
                    },
                    heroSection: {
                        eyebrow: doc.heroSection?.eyebrow || FALLBACK_ABOUT_DATA.heroSection.eyebrow,
                        heading: doc.heroSection?.heading || FALLBACK_ABOUT_DATA.heroSection.heading,
                        subtext: doc.heroSection?.subtext || FALLBACK_ABOUT_DATA.heroSection.subtext,
                        bgImage: sanitizeImg(doc.heroSection?.bgImage, FALLBACK_ABOUT_DATA.heroSection.bgImage),
                    },
                    companyStory: {
                        eyebrow: doc.companyStory?.eyebrow || FALLBACK_ABOUT_DATA.companyStory.eyebrow,
                        heading: doc.companyStory?.heading || FALLBACK_ABOUT_DATA.companyStory.heading,
                        image: sanitizeImg(doc.companyStory?.image, FALLBACK_ABOUT_DATA.companyStory.image),
                        items: doc.companyStory?.items?.length > 0
                            ? doc.companyStory.items.map((i: any) => ({ label: i.label, text: i.text }))
                            : FALLBACK_ABOUT_DATA.companyStory.items,
                    },
                    teamSection: {
                        eyebrow: doc.teamSection?.eyebrow || FALLBACK_ABOUT_DATA.teamSection.eyebrow,
                        heading: doc.teamSection?.heading || FALLBACK_ABOUT_DATA.teamSection.heading,
                        members: doc.teamSection?.members?.length > 0
                            ? doc.teamSection.members.map((m: any, idx: number) => ({
                                name: m.name,
                                role: m.role,
                                image: sanitizeImg(m.image, FALLBACK_ABOUT_DATA.teamSection.members[idx % 4]?.image || "/hero/1.jpg"),
                                bio: m.bio,
                            }))
                            : FALLBACK_ABOUT_DATA.teamSection.members,
                    },
                    statsSection: {
                        eyebrow: doc.statsSection?.eyebrow || FALLBACK_ABOUT_DATA.statsSection.eyebrow,
                        heading: doc.statsSection?.heading || FALLBACK_ABOUT_DATA.statsSection.heading,
                        stats: doc.statsSection?.stats?.length > 0
                            ? doc.statsSection.stats.map((s: any) => ({ value: s.value || 0, suffix: s.suffix || "+", label: s.label }))
                            : FALLBACK_ABOUT_DATA.statsSection.stats,
                    },
                    whyChooseUs: {
                        eyebrow: doc.whyChooseUs?.eyebrow || FALLBACK_ABOUT_DATA.whyChooseUs.eyebrow,
                        heading: doc.whyChooseUs?.heading || FALLBACK_ABOUT_DATA.whyChooseUs.heading,
                        items: doc.whyChooseUs?.items?.length > 0
                            ? doc.whyChooseUs.items.map((i: any) => ({ icon: i.icon || "star", title: i.title, desc: i.desc }))
                            : FALLBACK_ABOUT_DATA.whyChooseUs.items,
                    },
                };
            }
        } catch (error) {
            console.error("Error fetching AboutPage data:", error);
        }

        return FALLBACK_ABOUT_DATA;
    },
    ["about-page-cache"],
    { tags: ["about"], revalidate: 3600 }
);


