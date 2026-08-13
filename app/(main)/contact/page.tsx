import React from "react";
import PageHero from "@/components/main/shared/PageHero";
import ContactForm from "@/components/main/contact/ContactForm";
import QuickContact from "@/components/main/contact/QuickContact";
import WhatsAppCTA from "@/components/main/contact/WhatsAppCTA";

export const metadata = {
  title: "Contact | The Story Photography",
  description:
    "Book The Story for your wedding. Send us a message, call us, or chat on WhatsApp.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Let's Connect"
        heading="Book Your Date"
        subtext="Dates fill up fast. Reach out and let's create something beautiful together."
        bgImage="/hero/2.jpg"
      />

      <section className="w-full bg-neutral-950 py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-14">
          {/* Contact Form – takes 2 columns */}
          <div className="lg:col-span-2">
            <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-sans mb-3">
              Send A Message
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-white mb-8">
              Tell Us About Your Event
            </h2>
            <ContactForm />
          </div>

          {/* Sidebar – Quick Contact + WhatsApp */}
          <div className="lg:col-span-1 space-y-2">
            <QuickContact />
            <WhatsAppCTA />

            {/* Studio hours */}
            <div className="mt-6 p-5 border border-white/10 bg-white/5 rounded-sm space-y-3">
              <h4 className="text-xs tracking-widest uppercase text-red-500 font-sans">
                Studio Hours
              </h4>
              <div className="space-y-1 font-sans text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Saturday – Thursday</span>
                  <span className="text-white">10am – 8pm</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday</span>
                  <span className="text-white">By Appointment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
