import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestimonial extends Document {
    name: string;
    role: string;
    image: string;
    rating: number;
    comment: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        role: {
            type: String,
            default: "Happy Client",
            trim: true,
        },
        image: {
            type: String,
            default: "/hero/1.jpg",
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            default: 5,
        },
        comment: {
            type: String,
            required: [true, "Comment is required"],
            trim: true,
        },
        order: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Testimonial: Model<ITestimonial> =
    mongoose.models.Testimonial ||
    mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;
