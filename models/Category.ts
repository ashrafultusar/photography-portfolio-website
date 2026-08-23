import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            required: [true, "Category slug is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);


const Category: Model<ICategory> =
    (mongoose.models.Category as Model<ICategory>) ||
    mongoose.model<ICategory>("Category", categorySchema);

export default Category;
