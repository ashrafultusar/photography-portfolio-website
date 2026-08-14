import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuickLink {
    name: string;
    href: string;
}

export interface IFooter extends Document {
    logoUrl: string;
    brandName: string;
    brandLogoText: string;
    bio: string;
    location: string;
    phone: string;
    email: string;
    facebookUrl: string;
    instagramUrl: string;
    youtubeUrl: string;
    whatsappNumber: string;
    copyrightText: string;
    quickLinks: IQuickLink[];
    updatedAt: Date;
}

const FooterSchema = new Schema<IFooter>(
    {
        logoUrl: {
            type: String,
            default: "/logo.jpeg",
            trim: true,
        },
        brandName: {
            type: String,
            default: "Moment that matters",
            trim: true,
        },
        brandLogoText: {
            type: String,
            default: "MTM",
            trim: true,
        },
        bio: {
            type: String,
            default: "Capturing your eternal moments and preserving your wedding stories with cinematic elegance and professional photography.",
            trim: true,
        },
        location: {
            type: String,
            default: "Dhaka, Bangladesh",
            trim: true,
        },
        phone: {
            type: String,
            default: "+880 1234-567890",
            trim: true,
        },
        email: {
            type: String,
            default: "info@shondhikkhon.com",
            trim: true,
        },
        facebookUrl: {
            type: String,
            default: "https://facebook.com",
            trim: true,
        },
        instagramUrl: {
            type: String,
            default: "https://instagram.com",
            trim: true,
        },
        youtubeUrl: {
            type: String,
            default: "https://youtube.com",
            trim: true,
        },
        whatsappNumber: {
            type: String,
            default: "+8801700000000",
            trim: true,
        },
        copyrightText: {
            type: String,
            default: "Moment that matters. All rights reserved.",
            trim: true,
        },
        quickLinks: [
            {
                name: { type: String, required: true },
                href: { type: String, required: true },
            },
        ],
    },
    { timestamps: true }
);

const Footer: Model<IFooter> =
    mongoose.models.Footer || mongoose.model<IFooter>("Footer", FooterSchema);

export default Footer;
