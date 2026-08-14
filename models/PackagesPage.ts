import mongoose, { Schema, Document, Model } from "mongoose";

const PackageItemSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        tagline: { type: String, default: "", trim: true },
        price: { type: String, required: true, trim: true },
        unit: { type: String, default: "per event", trim: true },
        featured: { type: Boolean, default: false },
        features: [{ type: String, trim: true }],
    },
    { _id: false }
);

const AddOnItemSchema = new Schema(
    {
        icon: { type: String, default: "star", trim: true },
        title: { type: String, required: true, trim: true },
        desc: { type: String, default: "", trim: true },
        price: { type: String, required: true, trim: true },
    },
    { _id: false }
);

export interface IPackagesPage extends Document {
    heroSection: {
        eyebrow: string;
        heading: string;
        subtext: string;
        bgImage: string;
    };
    pricingSection: {
        sectionEyebrow: string;
        sectionHeading: string;
        sectionHeadingAccent: string;
        sectionDesc: string;
        noteText: string;
        packages: {
            name: string;
            tagline: string;
            price: string;
            unit: string;
            featured: boolean;
            features: string[];
        }[];
    };
    addOnsSection: {
        sectionEyebrow: string;
        sectionHeading: string;
        sectionDesc: string;
        ctaNote: string;
        addOns: {
            icon: string;
            title: string;
            desc: string;
            price: string;
        }[];
    };
    updatedAt: Date;
}

const PackagesPageSchema = new Schema<IPackagesPage>(
    {
        heroSection: {
            eyebrow: { type: String, default: "Pricing", trim: true },
            heading: { type: String, default: "Our Packages", trim: true },
            subtext: { type: String, default: "Transparent pricing crafted to suit every couple's dream day.", trim: true },
            bgImage: { type: String, default: "/hero/4.jpg", trim: true },
        },
        pricingSection: {
            sectionEyebrow: { type: String, default: "Investment", trim: true },
            sectionHeading: { type: String, default: "Choose Your", trim: true },
            sectionHeadingAccent: { type: String, default: "Story", trim: true },
            sectionDesc: { type: String, default: "Every package includes full post-processing, private online gallery, and a dedicated story editor.", trim: true },
            noteText: { type: String, default: "Need something custom? Let's talk.", trim: true },
            packages: { type: [PackageItemSchema], default: [] },
        },
        addOnsSection: {
            sectionEyebrow: { type: String, default: "Customize", trim: true },
            sectionHeading: { type: String, default: "Enhance Your Experience", trim: true },
            sectionDesc: { type: String, default: "Add-Ons — Customize your package with these premium additions.", trim: true },
            ctaNote: { type: String, default: "Mention your desired add-ons when booking and we'll tailor the perfect package for you.", trim: true },
            addOns: { type: [AddOnItemSchema], default: [] },
        },
    },
    { timestamps: true }
);

const PackagesPage: Model<IPackagesPage> =
    mongoose.models.PackagesPage ||
    mongoose.model<IPackagesPage>("PackagesPage", PackagesPageSchema);

export default PackagesPage;
