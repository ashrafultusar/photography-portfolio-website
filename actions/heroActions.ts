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

export interface HeroTextData {
    subtitle: string;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
}

const revalidateHeroCache = () => {
    try {
        (revalidateTag as any)("hero");
    } catch (e) {
        console.error("revalidateTag error:", e);
    }
    revalidatePath("/");
    revalidatePath("/my-dashboard/hero");
};

/**
 * Fetch uncached hero data for admin panel
 */
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

/**
 * Update ONLY hero text overlay (subtitle, title, description, button)
 */
export async function updateHeroTextAction(textData: HeroTextData) {
    try {
        await connectDB();
        let hero = await Hero.findOne();

        if (hero) {
            hero.subtitle = textData.subtitle;
            hero.title = textData.title;
            hero.description = textData.description;
            hero.buttonText = textData.buttonText;
            hero.buttonLink = textData.buttonLink;
            await hero.save();
        } else {
            hero = await Hero.create({
                ...textData,
                images: [],
            });
        }

        revalidateHeroCache();

        return {
            success: true,
            message: "Hero text overlay updated successfully!",
            hero: JSON.parse(JSON.stringify(hero)),
        };
    } catch (error: any) {
        console.error("Error updating hero text:", error);
        return {
            success: false,
            message: error.message || "Failed to update hero text.",
        };
    }
}

/**
 * Add a SINGLE slider image item to DB
 */
export async function addHeroSlideAction(slide: IHeroImage) {
    try {
        await connectDB();
        let hero = await Hero.findOne();

        if (hero) {
            hero.images.push(slide);
            await hero.save();
        } else {
            hero = await Hero.create({
                subtitle: "WEDDING & EVENT PHOTOGRAPHY",
                title: "The Story",
                description: "Capturing your eternal moments with cinematic elegance.",
                buttonText: "Book Us",
                buttonLink: "#book-us",
                images: [slide],
            });
        }

        return {
            success: true,
            message: "Slider image added successfully!",
            images: JSON.parse(JSON.stringify(hero.images)),
        };
    } catch (error: any) {
        console.error("Error adding hero slide:", error);
        return {
            success: false,
            message: error.message || "Failed to add slider image.",
        };
    }
}

/**
 * Add MULTIPLE slider image items in a single batch call to DB
 */
export async function addMultipleHeroSlidesAction(slides: IHeroImage[]) {
    try {
        if (!slides || slides.length === 0) {
            return { success: false, message: "No slides provided." };
        }

        await connectDB();
        let hero = await Hero.findOne();

        if (hero) {
            hero.images.push(...slides);
            hero.markModified("images");
            await hero.save();
        } else {
            hero = await Hero.create({
                subtitle: "WEDDING & EVENT PHOTOGRAPHY",
                title: "The Story",
                description: "Capturing your eternal moments with cinematic elegance.",
                buttonText: "Book Us",
                buttonLink: "#book-us",
                images: slides,
            });
        }

        revalidateHeroCache();

        return {
            success: true,
            message: `${slides.length} slider image(s) added successfully!`,
            images: JSON.parse(JSON.stringify(hero.images)),
        };
    } catch (error: any) {
        console.error("Error adding hero slides batch:", error);
        return {
            success: false,
            message: error.message || "Failed to add slider images.",
        };
    }
}

/**
 * Update a SINGLE slider image item at index
 */
export async function updateHeroSlideAction(index: number, slide: IHeroImage) {
    try {
        await connectDB();
        const hero = await Hero.findOne();

        if (!hero || !hero.images[index]) {
            return { success: false, message: "Slide item not found." };
        }

        hero.images[index] = slide;
        await hero.save();

        revalidateHeroCache();

        return {
            success: true,
            message: `Slider item #${index + 1} updated!`,
            images: JSON.parse(JSON.stringify(hero.images)),
        };
    } catch (error: any) {
        console.error("Error updating hero slide item:", error);
        return {
            success: false,
            message: error.message || "Failed to update slider item.",
        };
    }
}

/**
 * Delete a SINGLE slider image item at index
 */
export async function deleteHeroSlideAction(index: number) {
    try {
        await connectDB();
        const hero = await Hero.findOne();

        if (!hero || index < 0 || index >= hero.images.length) {
            return { success: false, message: "Slide item not found." };
        }

        const updatedImages = hero.images.filter((_: any, i: number) => i !== index);
        hero.images = updatedImages;
        hero.markModified("images");
        await hero.save();

        revalidateHeroCache();

        return {
            success: true,
            message: "Slider image deleted!",
            images: JSON.parse(JSON.stringify(updatedImages)),
        };
    } catch (error: any) {
        console.error("Error deleting hero slide:", error);
        return {
            success: false,
            message: error.message || "Failed to delete slider image.",
        };
    }
}

/**
 * Reorder slider images array in DB
 */
export async function reorderHeroSlidesAction(images: IHeroImage[]) {
    try {
        await connectDB();
        const hero = await Hero.findOne();

        if (hero) {
            hero.images = images;
            await hero.save();
        }

        revalidateHeroCache();

        return {
            success: true,
            message: "Slider queue order updated!",
            images: JSON.parse(JSON.stringify(hero?.images || [])),
        };
    } catch (error: any) {
        console.error("Error reordering hero slides:", error);
        return {
            success: false,
            message: error.message || "Failed to reorder slider images.",
        };
    }
}

/**
 * Save all Hero content (legacy / bulk backup)
 */
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

        revalidateHeroCache();

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


