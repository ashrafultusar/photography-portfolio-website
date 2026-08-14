import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContactPage extends Document {
    // Hero Section
    heroEyebrow: string;
    heroHeading: string;
    heroSubtext: string;
    heroBgImage: string;
    // Form section labels
    formEyebrow: string;
    formHeading: string;
    // Quick Contact
    phone: string;
    phoneHref: string;
    email: string;
    emailHref: string;
    studioAddress: string;
    studioMapsUrl: string;
    // WhatsApp
    whatsappNumber: string;
    whatsappMessage: string;
    // Studio Hours
    hoursRow1Label: string;
    hoursRow1Value: string;
    hoursRow2Label: string;
    hoursRow2Value: string;
    updatedAt: Date;
}

const ContactPageSchema = new Schema<IContactPage>(
    {
        heroEyebrow: { type: String, default: "Let's Connect", trim: true },
        heroHeading: { type: String, default: "Book Your Date", trim: true },
        heroSubtext: {
            type: String,
            default: "Dates fill up fast. Reach out and let's create something beautiful together.",
            trim: true,
        },
        heroBgImage: { type: String, default: "/hero/2.jpg", trim: true },
        formEyebrow: { type: String, default: "Send A Message", trim: true },
        formHeading: { type: String, default: "Tell Us About Your Event", trim: true },
        phone: { type: String, default: "+880 1700-000000", trim: true },
        phoneHref: { type: String, default: "tel:+8801700000000", trim: true },
        email: { type: String, default: "hello@thestory.com.bd", trim: true },
        emailHref: { type: String, default: "mailto:hello@thestory.com.bd", trim: true },
        studioAddress: { type: String, default: "Gulshan-1, Dhaka, Bangladesh", trim: true },
        studioMapsUrl: {
            type: String,
            default: "https://maps.google.com/?q=Gulshan+Dhaka",
            trim: true,
        },
        whatsappNumber: { type: String, default: "8801700000000", trim: true },
        whatsappMessage: {
            type: String,
            default: "Hello! I'm interested in booking The Story for my wedding. Can we discuss?",
            trim: true,
        },
        hoursRow1Label: { type: String, default: "Saturday – Thursday", trim: true },
        hoursRow1Value: { type: String, default: "10am – 8pm", trim: true },
        hoursRow2Label: { type: String, default: "Friday", trim: true },
        hoursRow2Value: { type: String, default: "By Appointment", trim: true },
    },
    { timestamps: true }
);

const ContactPage: Model<IContactPage> =
    mongoose.models.ContactPage ||
    mongoose.model<IContactPage>("ContactPage", ContactPageSchema);

export default ContactPage;
