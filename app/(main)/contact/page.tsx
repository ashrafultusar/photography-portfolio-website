import React from "react";
import PageHero from "@/components/main/shared/PageHero";
import ContactForm from "@/components/main/contact/ContactForm";
import QuickContact from "@/components/main/contact/QuickContact";
import WhatsAppCTA from "@/components/main/contact/WhatsAppCTA";
import { getContactPageData } from "@/lib/data/contactData";

export async function generateMetadata() {

  const data = await getContactPageData();
  return {
    title: `${data.heroHeading} | The Story Photography`,
    description: data.heroSubtext,
  };
}

export default async function ContactPage() {
  const data = await getContactPageData();

  return (
    <>
      <PageHero
        eyebrow={data.heroEyebrow}
        heading={data.heroHeading}
        subtext={data.heroSubtext}
        bgImage={data.heroBgImage}
      />

      <section className="w-full bg-[#e2e8f0] py-24 px-6 md:px-12 text-slate-800 border-t border-slate-300">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-14">
          {/* Contact Form – takes 2 columns */}
          <div className="lg:col-span-2">
            <p className="text-xs tracking-[0.3em] uppercase text-amber-600 font-sans font-bold mb-3">
              {data.formEyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-8">
              {data.formHeading}
            </h2>
            <ContactForm />
          </div>

          {/* Sidebar – Quick Contact + WhatsApp */}
          <div className="lg:col-span-1 space-y-2">
            <QuickContact
              phone={data.phone}
              phoneHref={data.phoneHref}
              email={data.email}
              emailHref={data.emailHref}
              studioAddress={data.studioAddress}
              studioMapsUrl={data.studioMapsUrl}
            />
            <WhatsAppCTA
              whatsappNumber={data.whatsappNumber}
              whatsappMessage={data.whatsappMessage}
            />

            {/* Studio hours */}
            <div className="mt-6 p-5 border border-slate-300 bg-white rounded-sm space-y-3 shadow-sm">
              <h4 className="text-xs tracking-widest uppercase text-amber-600 font-sans font-bold">
                Studio Hours
              </h4>
              <div className="space-y-1 font-sans text-sm text-slate-600 font-medium">
                <div className="flex justify-between">
                  <span>{data.hoursRow1Label}</span>
                  <span className="text-slate-900 font-bold">{data.hoursRow1Value}</span>
                </div>
                <div className="flex justify-between">
                  <span>{data.hoursRow2Label}</span>
                  <span className="text-slate-900 font-bold">{data.hoursRow2Value}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
