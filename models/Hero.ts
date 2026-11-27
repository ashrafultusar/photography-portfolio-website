import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHeroImage {
  src: string;
  alt: string;
}

export interface IHero extends Document {
  subtitle: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  images: IHeroImage[];
  updatedAt: Date;
}

const HeroSchema = new Schema<IHero>(
  {
    subtitle: {
      type: String,
      default: "Travel & Sports Photography",
      trim: true,
    },
    title: {
      type: String,
      default: "The Story",
      trim: true,
    },
    description: {
      type: String,
      default: "Capturing your eternal moments with cinematic elegance.",
      trim: true,
    },
    buttonText: {
      type: String,
      default: "Book Us",
      trim: true,
    },
    buttonLink: {
      type: String,
      default: "#book-us",
      trim: true,
    },
    images: [
      {
        src: { type: String, required: true },
        alt: { type: String, default: "Photography Hero Slider Image" },
      },
    ],
  },
  { timestamps: true }
);

const Hero: Model<IHero> =
  mongoose.models.Hero || mongoose.model<IHero>("Hero", HeroSchema);

export default Hero;
