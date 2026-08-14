"use client";

import { useState, useEffect } from "react";
import { getContactPageAction, updateContactPageAction } from "@/actions/contactActions";
import { uploadToCloudinary } from "@/actions/portfolioActions";
import { ContactPageData } from "@/lib/types/contact";

const DEFAULT: ContactPageData = {
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
    whatsappMessage: "Hello! I'm interested in booking The Story for my wedding. Can we discuss?",
    hoursRow1Label: "Saturday – Thursday",
    hoursRow1Value: "10am – 8pm",
    hoursRow2Label: "Friday",
    hoursRow2Value: "By Appointment",
};

const inputCls =
    "w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50";
const labelCls = "block text-xs font-semibold text-slate-700 mb-1.5";

export default function ContactManager() {
    const [formData, setFormData] = useState<ContactPageData>(DEFAULT);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingBg, setIsUploadingBg] = useState(false);
    const [statusMsg, setStatusMsg] = useState<string | null>(null);
    const [statusOk, setStatusOk] = useState(true);

    useEffect(() => {
        getContactPageAction().then((data) => {
            if (data) setFormData(data);
        });
    }, []);

    // Hero background image upload
    const handleBgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploadingBg(true);
        setStatusMsg("Uploading background image to Cloudinary...");
        setStatusOk(true);

        const fd = new FormData();
        fd.append("files", files[0]);

        const res = await uploadToCloudinary(fd);
        setIsUploadingBg(false);

        if (res.success && res.urls && res.urls.length > 0) {
            setFormData((prev) => ({ ...prev, heroBgImage: res.urls![0] }));
            setStatusMsg("Background image uploaded! Click Save to apply.");
        } else {
            setStatusMsg("Failed to upload background image.");
            setStatusOk(false);
        }
    };

    const set = (field: keyof ContactPageData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatusMsg("Saving contact page settings...");
        setStatusOk(true);

        const res = await updateContactPageAction(formData);
        setIsSubmitting(false);

        if (res.success) {
            setStatusMsg("Contact page updated successfully!");
            setStatusOk(true);
        } else {
            setStatusMsg(res.message || "Failed to update.");
            setStatusOk(false);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Contact Page Manager</h1>
                    <p className="text-sm text-slate-500">
                        Edit the hero section, quick contact details, WhatsApp, studio hours, and form labels.
                    </p>
                </div>
            </div>

            {/* Status Message */}
            {statusMsg && (
                <div
                    className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between ${statusOk
                            ? "bg-amber-50 border-amber-200 text-amber-900"
                            : "bg-red-50 border-red-200 text-red-900"
                        }`}
                >
                    <span>{statusMsg}</span>
                    <button onClick={() => setStatusMsg(null)} className="font-bold ml-4 opacity-70 hover:opacity-100">
                        ✕
                    </button>
                </div>
            )}

            {/* Live Preview */}
            <div className="bg-[#cbd5e1] p-6 sm:p-8 rounded-3xl border border-slate-300 text-slate-800 shadow-md space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-400/50 pb-2">
                    👁️ Live Contact Page Preview
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div className="space-y-1">
                        <span className="text-amber-800 text-xs font-bold uppercase tracking-widest block">Hero</span>
                        <p className="font-bold text-slate-900">{formData.heroHeading}</p>
                        <p className="text-slate-600 text-xs">{formData.heroSubtext}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-amber-800 text-xs font-bold uppercase tracking-widest block">Contact</span>
                        <p>📞 {formData.phone}</p>
                        <p>✉️ {formData.email}</p>
                        <p>📍 {formData.studioAddress}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-amber-800 text-xs font-bold uppercase tracking-widest block">Hours</span>
                        <div className="flex justify-between text-xs">
                            <span>{formData.hoursRow1Label}</span>
                            <span className="font-bold">{formData.hoursRow1Value}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span>{formData.hoursRow2Label}</span>
                            <span className="font-bold">{formData.hoursRow2Value}</span>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: Hero */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                    <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                        🌄 1. Hero Section
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelCls}>Eyebrow Label (small text)</label>
                            <input type="text" value={formData.heroEyebrow} onChange={set("heroEyebrow")} className={inputCls} placeholder="e.g. Let's Connect" />
                        </div>
                        <div>
                            <label className={labelCls}>Main Heading</label>
                            <input type="text" value={formData.heroHeading} onChange={set("heroHeading")} className={inputCls} placeholder="e.g. Book Your Date" />
                        </div>
                    </div>
                    <div>
                        <label className={labelCls}>Subtext</label>
                        <textarea rows={2} value={formData.heroSubtext} onChange={set("heroSubtext")} className={inputCls + " resize-none"} placeholder="Short descriptive line below the heading" />
                    </div>

                    {/* BG Image */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                            <span className="text-xs font-semibold text-slate-500 mb-2">Current Background:</span>
                            <div className="w-full h-24 rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
                                {formData.heroBgImage && (
                                    <img src={formData.heroBgImage} alt="Hero BG" className="w-full h-full object-cover" />
                                )}
                            </div>
                            <span className="text-[10px] text-slate-400 mt-2 font-mono truncate max-w-[180px]">{formData.heroBgImage}</span>
                        </div>
                        <div className="md:col-span-8 space-y-4">
                            <div className="p-5 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-center space-y-3">
                                <label className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer shadow-sm">
                                    {isUploadingBg ? "Uploading..." : "📁 Upload Hero Background Image"}
                                    <input type="file" accept="image/*" className="hidden" onChange={handleBgImageUpload} disabled={isUploadingBg} />
                                </label>
                                <p className="text-xs text-slate-500">Or enter URL below</p>
                            </div>
                            <div>
                                <label className={labelCls}>Background Image URL</label>
                                <input type="text" value={formData.heroBgImage} onChange={set("heroBgImage")} className={inputCls} placeholder="/hero/2.jpg or https://..." />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Form Labels */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                    <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                        📝 2. Form Section Labels
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelCls}>Form Eyebrow (small label above heading)</label>
                            <input type="text" value={formData.formEyebrow} onChange={set("formEyebrow")} className={inputCls} placeholder="e.g. Send A Message" />
                        </div>
                        <div>
                            <label className={labelCls}>Form Heading</label>
                            <input type="text" value={formData.formHeading} onChange={set("formHeading")} className={inputCls} placeholder="e.g. Tell Us About Your Event" />
                        </div>
                    </div>
                </div>

                {/* Section 3: Quick Contact */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                    <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                        📞 3. Quick Contact Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelCls}>Phone Display Text</label>
                            <input type="text" value={formData.phone} onChange={set("phone")} className={inputCls} placeholder="+880 1700-000000" />
                        </div>
                        <div>
                            <label className={labelCls}>Phone Link (href)</label>
                            <input type="text" value={formData.phoneHref} onChange={set("phoneHref")} className={inputCls} placeholder="tel:+8801700000000" />
                        </div>
                        <div>
                            <label className={labelCls}>Email Address Display</label>
                            <input type="text" value={formData.email} onChange={set("email")} className={inputCls} placeholder="hello@thestory.com.bd" />
                        </div>
                        <div>
                            <label className={labelCls}>Email Link (href)</label>
                            <input type="text" value={formData.emailHref} onChange={set("emailHref")} className={inputCls} placeholder="mailto:hello@thestory.com.bd" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelCls}>Studio Address Display</label>
                            <input type="text" value={formData.studioAddress} onChange={set("studioAddress")} className={inputCls} placeholder="Gulshan-1, Dhaka, Bangladesh" />
                        </div>
                        <div>
                            <label className={labelCls}>Studio Google Maps URL</label>
                            <input type="text" value={formData.studioMapsUrl} onChange={set("studioMapsUrl")} className={inputCls} placeholder="https://maps.google.com/..." />
                        </div>
                    </div>
                </div>

                {/* Section 4: WhatsApp */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                    <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                        💬 4. WhatsApp Button
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelCls}>WhatsApp Number (with country code, no +)</label>
                            <input type="text" value={formData.whatsappNumber} onChange={set("whatsappNumber")} className={inputCls} placeholder="8801700000000" />
                        </div>
                        <div>
                            <label className={labelCls}>Pre-filled WhatsApp Message</label>
                            <input type="text" value={formData.whatsappMessage} onChange={set("whatsappMessage")} className={inputCls} placeholder="Hello! I'd like to book..." />
                        </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-800 font-medium">
                        Preview link:{" "}
                        <span className="font-mono break-all">
                            https://wa.me/{formData.whatsappNumber}?text=...
                        </span>
                    </div>
                </div>

                {/* Section 5: Studio Hours */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                    <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                        🕐 5. Studio Hours
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelCls}>Row 1 — Day Label</label>
                            <input type="text" value={formData.hoursRow1Label} onChange={set("hoursRow1Label")} className={inputCls} placeholder="Saturday – Thursday" />
                        </div>
                        <div>
                            <label className={labelCls}>Row 1 — Hours Value</label>
                            <input type="text" value={formData.hoursRow1Value} onChange={set("hoursRow1Value")} className={inputCls} placeholder="10am – 8pm" />
                        </div>
                        <div>
                            <label className={labelCls}>Row 2 — Day Label</label>
                            <input type="text" value={formData.hoursRow2Label} onChange={set("hoursRow2Label")} className={inputCls} placeholder="Friday" />
                        </div>
                        <div>
                            <label className={labelCls}>Row 2 — Hours Value</label>
                            <input type="text" value={formData.hoursRow2Value} onChange={set("hoursRow2Value")} className={inputCls} placeholder="By Appointment" />
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-slate-500">Changes apply instantly to the public contact page.</p>
                    <button
                        type="submit"
                        disabled={isSubmitting || isUploadingBg}
                        className="px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-sm shadow-md disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                        {isSubmitting ? "Saving..." : "💾 Save Contact Page"}
                    </button>
                </div>
            </form>
        </div>
    );
}
