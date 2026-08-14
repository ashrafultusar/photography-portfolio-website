import mongoose, { Schema, Document, Model } from "mongoose";

const StoryItemSchema = new Schema(
    { label: { type: String, trim: true }, text: { type: String, trim: true } },
    { _id: false }
);

const TeamMemberSchema = new Schema(
    {
        name: { type: String, trim: true },
        role: { type: String, trim: true },
        image: { type: String, trim: true },
        bio: { type: String, trim: true },
    },
    { _id: false }
);

const StatItemSchema = new Schema(
    {
        value: { type: Number, default: 0 },
        suffix: { type: String, default: "+", trim: true },
        label: { type: String, trim: true },
    },
    { _id: false }
);

const WhyItemSchema = new Schema(
    {
        icon: { type: String, default: "star", trim: true },
        title: { type: String, trim: true },
        desc: { type: String, trim: true },
    },
    { _id: false }
);

const HomeStatSchema = new Schema(
    {
        icon: { type: String, default: "camera", trim: true },
        value: { type: String, trim: true },
        label: { type: String, trim: true },
    },
    { _id: false }
);

export interface IAboutPage extends Document {
    homeSection: {
        eyebrow: string;
        heading: string;
        description1: string;
        description2: string;
        sinceYear: string;
        image1: string;
        image2: string;
        stats: { icon: string; value: string; label: string }[];
        ctaText: string;
        ctaLink: string;
    };
    heroSection: { eyebrow: string; heading: string; subtext: string; bgImage: string };
    companyStory: { eyebrow: string; heading: string; image: string; items: { label: string; text: string }[] };
    teamSection: { eyebrow: string; heading: string; members: { name: string; role: string; image: string; bio: string }[] };
    statsSection: { eyebrow: string; heading: string; stats: { value: number; suffix: string; label: string }[] };
    whyChooseUs: { eyebrow: string; heading: string; items: { icon: string; title: string; desc: string }[] };
    updatedAt: Date;
}

const AboutPageSchema = new Schema<IAboutPage>(
    {
        homeSection: {
            eyebrow: { type: String, default: "Our Story", trim: true },
            heading: { type: String, default: "We Don't Just Take Photos, We Craft Timeless Memories", trim: true },
            description1: { type: String, default: "The Story is Dhaka's premier wedding photography studio, blending cinematic storytelling with authentic emotion. Every shutter click is a promise — to preserve the warmth, joy, and tears that make your day irreplaceable.", trim: true },
            description2: { type: String, default: "From intimate nikahs to grand wedding celebrations, we bring the same obsessive attention to light, composition, and feeling that transforms fleeting moments into heirlooms.", trim: true },
            sinceYear: { type: String, default: "2016", trim: true },
            image1: { type: String, default: "/hero/1.jpg", trim: true },
            image2: { type: String, default: "/hero/2.jpg", trim: true },
            stats: {
                type: [HomeStatSchema],
                default: [
                    { icon: "camera", value: "500+", label: "Stories Told" },
                    { icon: "heart", value: "8+", label: "Years of Love" },
                    { icon: "star", value: "4.9", label: "Client Rating" },
                    { icon: "award", value: "12+", label: "Awards Won" },
                ],
            },
            ctaText: { type: String, default: "Meet Our Team", trim: true },
            ctaLink: { type: String, default: "/about", trim: true },
        },
        heroSection: {
            eyebrow: { type: String, default: "Our Story", trim: true },
            heading: { type: String, default: "About The Story", trim: true },
            subtext: { type: String, default: "A Dhaka-based wedding photography studio crafting timeless memories since 2018.", trim: true },
            bgImage: { type: String, default: "/hero/3.jpg", trim: true },
        },
        companyStory: {
            eyebrow: { type: String, default: "Who We Are", trim: true },
            heading: { type: String, default: "A Studio Built on\nLove & Light", trim: true },
            image: { type: String, default: "/hero/2.jpg", trim: true },
            items: { type: [StoryItemSchema], default: [] },
        },
        teamSection: {
            eyebrow: { type: String, default: "The People", trim: true },
            heading: { type: String, default: "Meet Our Team", trim: true },
            members: { type: [TeamMemberSchema], default: [] },
        },
        statsSection: {
            eyebrow: { type: String, default: "By The Numbers", trim: true },
            heading: { type: String, default: "Our Journey So Far", trim: true },
            stats: { type: [StatItemSchema], default: [] },
        },
        whyChooseUs: {
            eyebrow: { type: String, default: "Why We're Different", trim: true },
            heading: { type: String, default: "Why Choose The Story", trim: true },
            items: { type: [WhyItemSchema], default: [] },
        },
    },
    { timestamps: true }
);

if (mongoose.models.AboutPage && !mongoose.models.AboutPage.schema.path("homeSection.eyebrow")) {
    delete (mongoose.models as any).AboutPage;
}

const AboutPage: Model<IAboutPage> =
    mongoose.models.AboutPage ||
    mongoose.model<IAboutPage>("AboutPage", AboutPageSchema);

export default AboutPage;

