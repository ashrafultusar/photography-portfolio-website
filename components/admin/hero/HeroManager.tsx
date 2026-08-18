"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { uploadToCloudinary } from "@/actions/portfolioActions";
import { updateHeroContent, getHeroContentAction } from "@/actions/heroActions";
import { HeroImageData } from "@/lib/types/hero";

export default function HeroManager() {
    const [formData, setFormData] = useState({
        subtitle: "WEDDING & EVENT PHOTOGRAPHY",
        title: "The Story",
        description: "Capturing your eternal moments with cinematic elegance.",
        buttonText: "Book Us",
        buttonLink: "#book-us",
        images: [] as HeroImageData[],
    });

    const [imageUrlInput, setImageUrlInput] = useState("");
    const [imageAltInput, setImageAltInput] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMsg, setStatusMsg] = useState<string | null>(null);
    const [activePreviewIdx, setActivePreviewIdx] = useState(0);

    // Load existing Hero section data on mount
    useEffect(() => {
        async function loadHero() {
            const data = await getHeroContentAction();
            if (data) {
                setFormData({
                    subtitle: data.subtitle || "WEDDING & EVENT PHOTOGRAPHY",
                    title: data.title || "The Story",
                    description: data.description || "Capturing your eternal moments with cinematic elegance.",
                    buttonText: data.buttonText || "Book Us",
                    buttonLink: data.buttonLink || "#book-us",
                    images: data.images || [],
                });
            }
        }
        loadHero();
    }, []);

    // Upload Slider Images directly to Cloudinary from client
    const handleSliderImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const fileList = Array.from(files);
        setStatusMsg(`Compressing & Uploading ${fileList.length} slider image(s)...`);

        const { uploadImagesDirectToCloudinary } = await import("@/lib/uploadClient");
        const res = await uploadImagesDirectToCloudinary(fileList, (completed, total) => {
            setStatusMsg(`Uploaded ${completed}/${total} images...`);
        });

        setIsUploading(false);

        if (res.success && res.urls.length > 0) {
            const newImages = res.urls.map((url, idx) => ({
                src: url,
                alt: `${formData.title || "Hero Slider"} Image ${formData.images.length + idx + 1}`,
            }));

            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...newImages],
            }));

            setStatusMsg(`Successfully uploaded ${res.urls.length} slider image(s)!`);
        } else {
            setStatusMsg("Failed to upload slider image(s).");
        }
    };


    // Add Image via Direct URL
    const handleAddDirectUrl = (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageUrlInput.trim()) return;

        const newImg: HeroImageData = {
            src: imageUrlInput.trim(),
            alt: imageAltInput.trim() || `${formData.title} Hero Image ${formData.images.length + 1}`,
        };

        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, newImg],
        }));

        setImageUrlInput("");
        setImageAltInput("");
        setStatusMsg("Added image via direct URL.");
    };

    // Update Image ALT text
    const handleUpdateImageAlt = (index: number, newAlt: string) => {
        setFormData((prev) => {
            const updated = [...prev.images];
            updated[index] = { ...updated[index], alt: newAlt };
            return { ...prev, images: updated };
        });
    };

    // Reorder Images
    const handleMoveImage = (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= formData.images.length) return;

        setFormData((prev) => {
            const updated = [...prev.images];
            const temp = updated[index];
            updated[index] = updated[targetIndex];
            updated[targetIndex] = temp;
            return { ...prev, images: updated };
        });
    };

    const handleRemoveImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
        if (activePreviewIdx >= formData.images.length - 1) {
            setActivePreviewIdx(Math.max(0, formData.images.length - 2));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.images.length === 0) {
            alert("Please upload or add at least 1 background slider image.");
            return;
        }

        setIsSubmitting(true);
        setStatusMsg("Saving Hero section content to Database...");

        const res = await updateHeroContent(formData);

        setIsSubmitting(false);

        if (res.success) {
            setStatusMsg("Hero section updated and live on Homepage!");
        } else {
            setStatusMsg(res.message || "Failed to update Hero section.");
        }
    };

    const activeImageSrc = formData.images[activePreviewIdx]?.src || formData.images[0]?.src || "/hero/1.jpg";

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hero Section Manager</h1>
                    <p className="text-sm text-slate-500">100% database-driven hero text, call-to-action button, and background slider images</p>
                </div>
            </div>

            {statusMsg && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-between">
                    <span>{statusMsg}</span>
                    <button onClick={() => setStatusMsg(null)} className="text-amber-700 hover:text-amber-950 font-bold ml-4">✕</button>
                </div>
            )}

            {/* Live Interactive Hero Preview Card */}
            <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 text-white shadow-xl overflow-hidden relative min-h-[300px] flex flex-col justify-center items-center text-center">
                {/* Background Image Preview */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={activeImageSrc}
                        alt="Hero Live Preview"
                        className="w-full h-full object-cover opacity-40 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/70" />
                </div>

                <div className="relative z-10 space-y-3 max-w-xl px-4">
                    <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-amber-400 font-mono font-semibold">
                        {formData.subtitle || "YOUR SUBTITLE HERE"}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-serif text-white font-light tracking-tight">
                        {formData.title || "YOUR MAIN TITLE"}
                    </h2>
                    <div className="w-12 h-0.5 bg-red-600 mx-auto" />
                    <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                        {formData.description || "Your hero description will appear here..."}
                    </p>
                    <div className="pt-2">
                        <span className="inline-block px-6 py-2 border border-white text-white text-xs tracking-widest uppercase font-sans rounded-md">
                            {formData.buttonText || "Button"} ({formData.buttonLink})
                        </span>
                    </div>
                </div>

                {/* Slider Image Dots Indicator */}
                {formData.images.length > 0 && (
                    <div className="absolute bottom-3 z-10 flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
                        {formData.images.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setActivePreviewIdx(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${idx === activePreviewIdx ? "bg-amber-400 w-4" : "bg-slate-600 hover:bg-slate-400"}`}
                                title={`View image #${idx + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: Hero Text & Button Settings */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                    <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                        ✏️ 1. Hero Text Overlay Content
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Subtitle */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Subtitle (Top Small Tag)</label>
                            <input
                                type="text"
                                required
                                value={formData.subtitle}
                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                placeholder="e.g. WEDDING & EVENT PHOTOGRAPHY"
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                        </div>

                        {/* Main Title */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Main Title (Large Heading)</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. The Story"
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hero Description</label>
                        <textarea
                            rows={3}
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe your photography studio tagline..."
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Button Text */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Call to Action Button Text</label>
                            <input
                                type="text"
                                required
                                value={formData.buttonText}
                                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                                placeholder="e.g. Book Us"
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                        </div>

                        {/* Button Link */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Button Target Link / Anchor ID</label>
                            <input
                                type="text"
                                required
                                value={formData.buttonLink}
                                onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                                placeholder="e.g. #book-us or /contact"
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Background Slider Images */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            🖼️ 2. Background Slider Images ({formData.images.length})
                        </h2>
                    </div>

                    {/* Method A: File Upload */}
                    <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-center space-y-3">
                        <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>

                        <label className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer shadow-sm">
                            {isUploading ? "Uploading to Cloudinary..." : "Upload Slider Images (Cloudinary)"}
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={handleSliderImageUpload}
                                disabled={isUploading}
                            />
                        </label>
                        <p className="text-xs text-slate-400">Select one or multiple high-resolution photos for the Hero slider</p>
                    </div>

                    {/* Method B: Direct URL Input */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Or Add Image via Direct URL:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                            <input
                                type="url"
                                value={imageUrlInput}
                                onChange={(e) => setImageUrlInput(e.target.value)}
                                placeholder="https://res.cloudinary.com/... or /hero/1.jpg"
                                className="sm:col-span-6 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                            <input
                                type="text"
                                value={imageAltInput}
                                onChange={(e) => setImageAltInput(e.target.value)}
                                placeholder="Image ALT description (SEO)"
                                className="sm:col-span-4 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                            <button
                                type="button"
                                onClick={handleAddDirectUrl}
                                className="sm:col-span-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
                            >
                                + Add URL
                            </button>
                        </div>
                    </div>

                    {/* Slider Image List & Manager */}
                    {formData.images.length > 0 && (
                        <div className="space-y-4 pt-2">
                            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Slider Image Queue ({formData.images.length}) - Reorder & Edit ALT
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {formData.images.map((img, i) => (
                                    <div
                                        key={i}
                                        className={`flex items-center gap-3 p-3 rounded-2xl border ${i === activePreviewIdx ? "border-amber-400 bg-amber-50/30" : "border-slate-200 bg-white"} shadow-sm`}
                                    >
                                        <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                                            <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                                            <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                                                #{i + 1}
                                            </span>
                                        </div>

                                        <div className="flex-grow space-y-1.5 min-w-0">
                                            <input
                                                type="text"
                                                value={img.alt}
                                                onChange={(e) => handleUpdateImageAlt(i, e.target.value)}
                                                placeholder="ALT description..."
                                                className="w-full px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            />
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    disabled={i === 0}
                                                    onClick={() => handleMoveImage(i, "up")}
                                                    className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 font-semibold"
                                                >
                                                    ↑ Move Up
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={i === formData.images.length - 1}
                                                    onClick={() => handleMoveImage(i, "down")}
                                                    className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 font-semibold"
                                                >
                                                    ↓ Move Down
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setActivePreviewIdx(i)}
                                                    className="text-[10px] px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold"
                                                >
                                                    Preview
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(i)}
                                            className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                                            title="Delete image"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Submit */}
                <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-slate-500">
                        Changes are cached & revalidated instantly across the main website homepage.
                    </p>
                    <button
                        type="submit"
                        disabled={isSubmitting || isUploading}
                        className="px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-sm shadow-md disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                        {isSubmitting ? "Saving to Database..." : "💾 Save Hero Section Content"}
                    </button>
                </div>
            </form>
        </div>
    );
}

