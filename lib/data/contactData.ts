import { connectDB } from "@/db/dbConfig";
import ContactPage from "@/models/ContactPage";
import { ContactPageData } from "@/lib/types/contact";

const FALLBACK: ContactPageData = {
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

export async function getContactPageData(): Promise<ContactPageData> {
    try {
        await connectDB();
        const doc: any = await ContactPage.findOne().lean();

        if (doc) {
            return {
                heroEyebrow: doc.heroEyebrow || FALLBACK.heroEyebrow,
                heroHeading: doc.heroHeading || FALLBACK.heroHeading,
                heroSubtext: doc.heroSubtext || FALLBACK.heroSubtext,
                heroBgImage: doc.heroBgImage || FALLBACK.heroBgImage,
                formEyebrow: doc.formEyebrow || FALLBACK.formEyebrow,
                formHeading: doc.formHeading || FALLBACK.formHeading,
                phone: doc.phone || FALLBACK.phone,
                phoneHref: doc.phoneHref || FALLBACK.phoneHref,
                email: doc.email || FALLBACK.email,
                emailHref: doc.emailHref || FALLBACK.emailHref,
                studioAddress: doc.studioAddress || FALLBACK.studioAddress,
                studioMapsUrl: doc.studioMapsUrl || FALLBACK.studioMapsUrl,
                whatsappNumber: doc.whatsappNumber || FALLBACK.whatsappNumber,
                whatsappMessage: doc.whatsappMessage || FALLBACK.whatsappMessage,
                hoursRow1Label: doc.hoursRow1Label || FALLBACK.hoursRow1Label,
                hoursRow1Value: doc.hoursRow1Value || FALLBACK.hoursRow1Value,
                hoursRow2Label: doc.hoursRow2Label || FALLBACK.hoursRow2Label,
                hoursRow2Value: doc.hoursRow2Value || FALLBACK.hoursRow2Value,
            };
        }
    } catch (error) {
        console.error("Error fetching ContactPage data:", error);
    }

    return FALLBACK;
}
