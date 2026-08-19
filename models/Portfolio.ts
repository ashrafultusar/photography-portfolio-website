import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPortfolioImage {
    src: string;
    alt: string;
}

export interface IPortfolioAlbum extends Document {
    title: string;
    slug: string;
    category: string;
    clientName: string;
    eventDate: string;
    location: string;
    description: string;
    coverImage: string;
    images: IPortfolioImage[];
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const portfolioImageSchema = new Schema<IPortfolioImage>(
    {
        src: { type: String, required: true },
        alt: { type: String, default: "" },
    },
    { _id: false }
);

const portfolioAlbumSchema = new Schema<IPortfolioAlbum>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        slug: {
            type: String,
            required: [true, "Slug is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
        },
        clientName: {
            type: String,
            default: "",
        },
        eventDate: {
            type: String,
            required: [true, "Event Date is required"],
        },
        location: {
            type: String,
            required: [true, "Location is required"],
            default: "Dhaka, Bangladesh",
        },
        description: {
            type: String,
            default: "",
        },
        coverImage: {
            type: String,
            required: [true, "Cover image URL is required"],
        },
        images: {
            type: [portfolioImageSchema],
            default: [],
        },
        featured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Portfolio: Model<IPortfolioAlbum> =
    (mongoose.models.Portfolio as Model<IPortfolioAlbum>) ||
    mongoose.model<IPortfolioAlbum>("Portfolio", portfolioAlbumSchema);

export default Portfolio;
