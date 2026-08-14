"use server";

import { connectDB } from "@/db/dbConfig";
import Hero, { IHeroImage } from "@/models/Hero";
import { revalidatePath, revalidateTag } from "next/cache";

export interface HeroInputData {
    subtitle: string;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    images: IHeroImage[];
}

export async function updateHeroContent(data: HeroInputData) {
    try {
        await connectDB();

        let hero = await Hero.findOne();

        if (hero) {
            hero.subtitle = data.subtitle;
            hero.title = data.title;
            hero.description = data.description;
            hero.buttonText = data.buttonText;
            hero.buttonLink = data.buttonLink;
            hero.images = data.images;
            await hero.save();
        } else {
            hero = await Hero.create(data);
        }

        (revalidateTag as any)("hero");
        revalidatePath("/");
        revalidatePath("/my-dashboard/hero");

        return {
            success: true,
            message: "Hero section updated successfully!",
            hero: JSON.parse(JSON.stringify(hero)),
        };
    } catch (error: any) {
        console.error("Error updating hero section:", error);
        return {
            success: false,
            message: error.message || "Failed to update Hero section.",
        };
    }
}

export async function getHeroContentAction() {
    try {
        const { getHeroData } = await import("@/lib/data/heroData");
        return await getHeroData();
    } catch (error) {
        console.error("Error in getHeroContentAction:", error);
        return {
            subtitle: "WEDDING & EVENT PHOTOGRAPHY",
            title: "The Story",
            description: "Capturing your eternal moments with cinematic elegance.",
            buttonText: "Book Us",
            buttonLink: "#book-us",
            images: [],
        };
    }
}

