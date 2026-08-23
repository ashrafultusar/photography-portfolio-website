"use server";

import { connectDB } from "@/db/dbConfig";
import ContactPage from "@/models/ContactPage";
import { ContactPageData } from "@/lib/types/contact";
import { revalidatePath, revalidateTag } from "next/cache";

export async function updateContactPageAction(data: ContactPageData) {
    try {
        await connectDB();

        let doc = await ContactPage.findOne();

        if (doc) {
            Object.assign(doc, data);
            await doc.save();
        } else {
            doc = await ContactPage.create(data);
        }

        (revalidateTag as any)("contact");
        revalidatePath("/", "layout");
        revalidatePath("/contact");
        revalidatePath("/my-dashboard/contact");


        return {
            success: true,
            message: "Contact page updated successfully!",
            data: JSON.parse(JSON.stringify(doc)),
        };
    } catch (error: any) {
        console.error("Error updating ContactPage:", error);
        return {
            success: false,
            message: error.message || "Failed to update contact page.",
        };
    }
}

export async function getContactPageAction(): Promise<ContactPageData> {
    try {
        const { getContactPageData } = await import("@/lib/data/contactData");
        return await getContactPageData();
    } catch (error) {
        console.error("Error in getContactPageAction:", error);
        return {
            heroEyebrow: "Let's Connect",
            heroHeading: "Book Your Date",
            heroSubtext: "Dates fill up fast. Reach out and let's create something beautiful together.",
            heroBgImage: "/hero/2.jpg",
            formEyebrow: "Send A Message",
            formHeading: "Tell Us About Your Event",
            phone: "+880 1700-000000",
            phoneHref: "tel:+8801700000000",
            email: "hello@thestory.com.bd",
            emailHref: "mailto:hello@thestory.com.bd",
            studioAddress: "Gulshan-1, Dhaka, Bangladesh",
            studioMapsUrl: "https://maps.google.com/?q=Gulshan+Dhaka",
            whatsappNumber: "8801700000000",
            whatsappMessage:
                "Hello! I'm interested in booking The Story for my wedding. Can we discuss?",
            hoursRow1Label: "Saturday – Thursday",
            hoursRow1Value: "10am – 8pm",
            hoursRow2Label: "Friday",
            hoursRow2Value: "By Appointment",
        };
    }
}
