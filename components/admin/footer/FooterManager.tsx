"use client";

import { useState, useEffect } from "react";
import { updateFooterContent, getFooterContentAction } from "@/actions/footerActions";
import { uploadToCloudinary } from "@/actions/portfolioActions";
import { FooterData, QuickLinkItem } from "@/lib/types/footer";

export default function FooterManager() {
    const [formData, setFormData] = useState<FooterData>({
        logoUrl: "/logo.jpeg",
        brandName: "Moment that matters",
        brandLogoText: "MTM",
        bio: "Capturing your eternal moments and preserving your wedding stories with cinematic elegance and professional photography.",
        location: "Dhaka, Bangladesh",
        phone: "+880 1234-567890",
        email: "info@shondhikkhon.com",
        facebookUrl: "https://facebook.com",
        instagramUrl: "https://instagram.com",
        youtubeUrl: "https://youtube.com",
        whatsappNumber: "+8801700000000",
        copyrightText: "Moment that matters. All rights reserved.",
        quickLinks: [
            { name: "Home", href: "/" },
            { name: "About Us", href: "/about" },
            { name: "Portfolio", href: "/portfolio" },
            { name: "Packages", href: "/packages" },
            { name: "Book Us", href: "/contact" },
        ],
    });

    const [newLinkName, setNewLinkName] = useState("");
    const [newLinkHref, setNewLinkHref] = useState("");
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMsg, setStatusMsg] = useState<string | null>(null);

    // Load existing Footer data on mount
    useEffect(() => {
        async function loadFooter() {
            const data = await getFooterContentAction();
            if (data) {
                setFormData({
                    logoUrl: data.logoUrl || "/logo.jpeg",
                    brandName: data.brandName || "Moment that matters",
                    brandLogoText: data.brandLogoText || "MTM",
                    bio: data.bio || "Capturing your eternal moments and preserving your wedding stories...",
                    location: data.location || "Dhaka, Bangladesh",
                    phone: data.phone || "+880 1234-567890",
                    email: data.email || "info@shondhikkhon.com",
                    facebookUrl: data.facebookUrl || "https://facebook.com",
                    instagramUrl: data.instagramUrl || "https://instagram.com",
                    youtubeUrl: data.youtubeUrl || "https://youtube.com",
                    whatsappNumber: data.whatsappNumber || "+8801700000000",
                    copyrightText: data.copyrightText || "Moment that matters. All rights reserved.",
                    quickLinks: data.quickLinks || [],
                });
            }
        }
        loadFooter();
    }, []);

    // Direct Logo File Upload to Cloudinary from client
    const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploadingLogo(true);
        setStatusMsg("Compressing & uploading new logo image to Cloudinary...");

        const { uploadImagesDirectToCloudinary } = await import("@/lib/uploadClient");
        const res = await uploadImagesDirectToCloudinary([files[0]]);

        setIsUploadingLogo(false);

        if (res.success && res.urls && res.urls.length > 0) {
            const newLogoUrl = res.urls[0];
            setFormData((prev) => ({
                ...prev,
                logoUrl: newLogoUrl,
            }));
            setStatusMsg("Logo uploaded successfully! Click Save to apply changes.");
        } else {
            setStatusMsg(res.errors[0] || "Failed to upload logo image.");
        }
    };


    // Quick Link Handlers
    const handleAddQuickLink = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLinkName.trim() || !newLinkHref.trim()) return;

        const link: QuickLinkItem = {
            name: newLinkName.trim(),
            href: newLinkHref.trim(),
        };

        setFormData((prev) => ({
            ...prev,
            quickLinks: [...prev.quickLinks, link],
        }));

        setNewLinkName("");
        setNewLinkHref("");
    };

    const handleRemoveQuickLink = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            quickLinks: prev.quickLinks.filter((_, i) => i !== index),
        }));
    };

    const handleUpdateQuickLink = (index: number, field: "name" | "href", val: string) => {
        setFormData((prev) => {
            const updated = [...prev.quickLinks];
            updated[index] = { ...updated[index], [field]: val };
            return { ...prev, quickLinks: updated };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true);
        setStatusMsg("Saving Brand & Footer settings to Database...");

        const res = await updateFooterContent(formData);

        setIsSubmitting(false);

        if (res.success) {
            setStatusMsg("Brand & Footer updated instantly across website!");
        } else {
            setStatusMsg(res.message || "Failed to update settings.");
        }
    };

    const currentLogo = formData.logoUrl || "/logo.jpeg";

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Logo & Footer Manager</h1>
                    <p className="text-sm text-slate-500">Upload studio logo image, edit brand name, contact details, quick links, social media, and copyright notice</p>
                </div>
            </div>

            {statusMsg && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-between">
                    <span>{statusMsg}</span>
                    <button onClick={() => setStatusMsg(null)} className="text-amber-700 hover:text-amber-950 font-bold ml-4">✕</button>
                </div>
            )}

            {/* Live Footer Preview Card */}
            <div className="bg-[#cbd5e1] p-6 sm:p-8 rounded-3xl border border-slate-300 text-slate-800 shadow-md space-y-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-400/50 pb-2 flex items-center justify-between">
                    <span>👁️ Live Brand & Footer Preview</span>
                    <span className="text-[10px] text-amber-800 font-mono">Navbar & Footer Sync</span>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    {/* Brand Preview with Image Logo */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            {currentLogo ? (
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-slate-300 shadow-sm flex items-center justify-center p-1">
                                    <img src={currentLogo} alt="Studio Logo" className="w-full h-full object-contain" />
                                </div>
                            ) : (
                                <div className="w-9 h-9 border border-amber-600 bg-amber-400 rounded-full flex items-center justify-center font-bold text-[10px] text-slate-950">
                                    {formData.brandLogoText || "MTM"}
                                </div>
                            )}
                            <div>
                                <span className="font-bold text-slate-950 text-base font-serif block leading-tight">
                                    {formData.brandName || "Moment that matters"}
                                </span>
                                <span className="text-[10px] tracking-[0.25em] text-slate-600 uppercase font-sans font-medium">
                                    Photography
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-sans">
                            {formData.bio || "Bio tagline..."}
                        </p>
                    </div>

                    {/* Quick Links Preview */}
                    <div className="space-y-2">
                        <span className="text-amber-800 text-xs font-bold font-sans uppercase tracking-widest block">Quick Links</span>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-800 font-sans font-medium">
                            {formData.quickLinks.map((link, idx) => (
                                <span key={idx} className="hover:underline">{link.name}</span>
                            ))}
                        </div>
                    </div>

                    {/* Contact Preview */}
                    <div className="space-y-1.5 text-xs text-slate-700 font-sans font-medium">
                        <span className="text-amber-800 text-xs font-bold font-sans uppercase tracking-widest block mb-1">Get In Touch</span>
                        <p>📍 {formData.location}</p>
                        <p>📞 {formData.phone}</p>
                        <p>✉️ {formData.email}</p>
                    </div>
                </div>
                <div className="pt-3 border-t border-slate-400/40 text-center text-[11px] text-slate-600 font-sans">
                    © {new Date().getFullYear()} {formData.copyrightText}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: Dynamic Logo Image Upload */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                    <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                        🖼️ 1. Studio Logo Image Upload (Cloudinary)
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        {/* Logo Thumbnail Preview */}
                        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                            <span className="text-xs font-semibold text-slate-500 mb-2">Current Active Logo:</span>
                            <div className="w-24 h-24 rounded-2xl bg-white border border-slate-300 p-2 shadow-sm flex items-center justify-center overflow-hidden">
                                <img src={currentLogo} alt="Studio Logo Preview" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-[10px] text-slate-400 mt-2 font-mono truncate max-w-[180px]">{currentLogo}</span>
                        </div>

                        {/* File Upload Controls */}
                        <div className="md:col-span-8 space-y-4">
                            <div className="p-5 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-center space-y-3">
                                <label className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer shadow-sm">
                                    {isUploadingLogo ? "Uploading Logo to Cloudinary..." : "📁 Upload New Logo File"}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleLogoFileUpload}
                                        disabled={isUploadingLogo}
                                    />
                                </label>
                                <p className="text-xs text-slate-500 font-medium">Select logo image file (PNG, JPG, JPEG, SVG) from your computer</p>
                            </div>

                            {/* Direct URL Input fallback */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Or Logo Image URL:</label>
                                <input
                                    type="text"
                                    value={formData.logoUrl || ""}
                                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                                    placeholder="/logo.jpeg or https://res.cloudinary.com/..."
                                    className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-mono"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Brand Text Settings */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                    <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                        🏷️ 2. Brand Name & Bio Settings
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Brand Name</label>
                            <input
                                type="text"
                                required
                                value={formData.brandName}
                                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                                placeholder="e.g. Moment that matters"
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Brand Logo Badge Initials</label>
                            <input
                                type="text"
                                required
                                value={formData.brandLogoText}
                                onChange={(e) => setFormData({ ...formData, brandLogoText: e.target.value })}
                                placeholder="e.g. MTM"
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Brand Bio / Tagline</label>
                        <textarea
                            rows={3}
                            required
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Brief description of your studio..."
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        />
                    </div>
                </div>

                {/* Section 3: Contact Information */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                    <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                        📞 3. Contact Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Studio Location</label>
                            <input
                                type="text"
                                required
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="e.g. Dhaka, Bangladesh"
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Contact Phone</label>
                            <input
                                type="text"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="e.g. +880 1234-567890"
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="e.g. info@shondhikkhon.com"
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 4: Social Media & WhatsApp Links */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                    <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                        🌐 4. Social Media & Channels
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Facebook Page URL</label>
                            <input
                                type="url"
                                value={formData.facebookUrl}
                                onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                                placeholder="https://facebook.com/..."
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Instagram Profile URL</label>
                            <input
                                type="url"
                                value={formData.instagramUrl}
                                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                                placeholder="https://instagram.com/..."
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">YouTube Channel URL</label>
                            <input
                                type="url"
                                value={formData.youtubeUrl}
                                onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                                placeholder="https://youtube.com/..."
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">WhatsApp Number (with country code)</label>
                            <input
                                type="text"
                                value={formData.whatsappNumber}
                                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                placeholder="+8801700000000"
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 5: Quick Navigation Links */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                    <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                        🔗 5. Quick Links Navigation
                    </h2>

                    {/* Add Link Input */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Add New Navigation Link:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                            <input
                                type="text"
                                value={newLinkName}
                                onChange={(e) => setNewLinkName(e.target.value)}
                                placeholder="Link Label (e.g. Portfolio)"
                                className="sm:col-span-5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                            <input
                                type="text"
                                value={newLinkHref}
                                onChange={(e) => setNewLinkHref(e.target.value)}
                                placeholder="Target Path (e.g. /portfolio)"
                                className="sm:col-span-5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                            <button
                                type="button"
                                onClick={handleAddQuickLink}
                                className="sm:col-span-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
                            >
                                + Add Link
                            </button>
                        </div>
                    </div>

                    {/* Link Items Queue */}
                    {formData.quickLinks.length > 0 && (
                        <div className="space-y-3">
                            {formData.quickLinks.map((link, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <span className="text-xs font-bold text-slate-400 font-mono">#{idx + 1}</span>
                                    <input
                                        type="text"
                                        value={link.name}
                                        onChange={(e) => handleUpdateQuickLink(idx, "name", e.target.value)}
                                        className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                                        placeholder="Label"
                                    />
                                    <input
                                        type="text"
                                        value={link.href}
                                        onChange={(e) => handleUpdateQuickLink(idx, "href", e.target.value)}
                                        className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500 flex-grow"
                                        placeholder="Path"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveQuickLink(idx)}
                                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                                        title="Delete link"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Section 6: Copyright Text */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                    <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                        ©️ 6. Copyright Notice
                    </h2>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Copyright Rights Text</label>
                        <input
                            type="text"
                            required
                            value={formData.copyrightText}
                            onChange={(e) => setFormData({ ...formData, copyrightText: e.target.value })}
                            placeholder="e.g. Moment that matters. All rights reserved."
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-slate-500">
                        Updates apply instantly to top Navbar and bottom Footer.
                    </p>
                    <button
                        type="submit"
                        disabled={isSubmitting || isUploadingLogo}
                        className="px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-sm shadow-md disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                        {isSubmitting ? "Saving to Database..." : "💾 Save Brand & Logo Settings"}
                    </button>
                </div>
            </form>
        </div>
    );
}
