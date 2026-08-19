"use client";

import { useState, useEffect } from "react";
import {
    getHeroContentAction,
    updateHeroTextAction,
    addHeroSlideAction,
    updateHeroSlideAction,
    deleteHeroSlideAction,
    reorderHeroSlidesAction,
    addMultipleHeroSlidesAction,
} from "@/actions/heroActions";
import { HeroImageData, HeroSectionData } from "@/lib/types/hero";

interface HeroManagerProps {
    initialData?: HeroSectionData;
}

export default function HeroManager({ initialData }: HeroManagerProps) {
    const [loading, setLoading] = useState(!initialData);
    const [textData, setTextData] = useState({
        subtitle: initialData?.subtitle || "WEDDING & EVENT PHOTOGRAPHY",
        title: initialData?.title || "The Story",
        description: initialData?.description || "Capturing your eternal moments with cinematic elegance.",
        buttonText: initialData?.buttonText || "Book Us",
        buttonLink: initialData?.buttonLink || "#book-us",
    });

    const [images, setImages] = useState<HeroImageData[]>(initialData?.images || []);

    const [isUploading, setIsUploading] = useState(false);
    const [isSavingText, setIsSavingText] = useState(false);
    const [savingItemIdx, setSavingItemIdx] = useState<number | null>(null);
    const [statusMsg, setStatusMsg] = useState<string | null>(null);
    const [activePreviewIdx, setActivePreviewIdx] = useState(0);

    useEffect(() => {
        if (initialData) {
            setLoading(false);
            return;
        }
        getHeroContentAction().then((d) => {
            if (d) {
                setTextData({
                    subtitle: d.subtitle || "WEDDING & EVENT PHOTOGRAPHY",
                    title: d.title || "The Story",
                    description: d.description || "Capturing your eternal moments with cinematic elegance.",
                    buttonText: d.buttonText || "Book Us",
                    buttonLink: d.buttonLink || "#book-us",
                });
                setImages(d.images || []);
            }
            setLoading(false);
        });
    }, [initialData]);

    if (loading) return (
        <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
        </div>
    );

    // Save Hero Text Overlay Content
    const handleSaveHeroText = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsSavingText(true);
        setStatusMsg("Saving Hero text content to Database...");

        const res = await updateHeroTextAction(textData);
        setIsSavingText(false);

        if (res.success) {
            setStatusMsg("✅ Hero text content saved & live on homepage!");
        } else {
            setStatusMsg(`❌ ${res.message || "Failed to save hero text."}`);
        }
    };

    // Ultra-Fast Parallel Direct Browser Upload & Batch DB Persistence (<1s)
    const handleSliderImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const fileList = Array.from(files);
        setStatusMsg(`Uploading ${fileList.length} image(s) directly to Cloudinary...`);

        const { uploadImagesDirectToCloudinary } = await import("@/lib/uploadClient");

        // Step 1: Direct Browser -> Cloudinary REST API upload in parallel (Bypasses Vercel Serverless latency)
        const uploadRes = await uploadImagesDirectToCloudinary(fileList, (completed, total) => {
            setStatusMsg(`Uploaded ${completed}/${total} images directly to Cloudinary...`);
        });

        if (uploadRes.success && uploadRes.urls.length > 0) {
            const newSlides: HeroImageData[] = uploadRes.urls.map((url, idx) => ({
                src: url,
                alt: `${textData.title || "Hero Slider"} Image ${images.length + idx + 1}`,
            }));

            // Step 2: Batch DB save in single roundtrip (~50ms)
            setStatusMsg("Saving new slider image(s) to Database...");
            const dbRes = await addMultipleHeroSlidesAction(newSlides);

            if (dbRes.success && dbRes.images) {
                setImages(dbRes.images);
                setStatusMsg(`✅ Successfully uploaded & added ${uploadRes.urls.length} image(s)!`);
            } else {
                setStatusMsg(`❌ ${dbRes.message || "Failed to save slider images to database."}`);
            }
        } else {
            setStatusMsg(`❌ Upload failed: ${uploadRes.errors?.join(", ") || "Cloudinary connection issue."}`);
        }

        setIsUploading(false);
        e.target.value = "";
    };

    // Item-by-item ALT update local input state
    const handleLocalAltChange = (index: number, newAlt: string) => {
        setImages((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], alt: newAlt };
            return updated;
        });
    };

    // Item-by-item Save single slide changes (e.g. ALT text update)
    const handleSaveSingleSlide = async (index: number) => {
        const slideToUpdate = images[index];
        if (!slideToUpdate) return;

        setSavingItemIdx(index);
        setStatusMsg(`Saving slider item #${index + 1}...`);

        const res = await updateHeroSlideAction(index, slideToUpdate);
        setSavingItemIdx(null);

        if (res.success && res.images) {
            setImages(res.images);
            setStatusMsg(`✅ Slider item #${index + 1} updated in Database!`);
        } else {
            setStatusMsg(`❌ ${res.message || "Failed to update slider item."}`);
        }
    };

    // Item-by-item Delete single slide item (Instant Optimistic UI update)
    const handleDeleteSingleSlide = async (index: number) => {
        if (!confirm(`Are you sure you want to delete slider image #${index + 1}?`)) return;

        // Backup current images for rollback if DB update fails
        const previousImages = [...images];

        // ⚡ Optimistic UI update: remove item instantly from DOM
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
        if (activePreviewIdx >= newImages.length) {
            setActivePreviewIdx(Math.max(0, newImages.length - 1));
        }

        setStatusMsg(`Deleting slider item #${index + 1}...`);
        const res = await deleteHeroSlideAction(index);

        if (res.success && res.images) {
            setImages(res.images);
            setStatusMsg(`✅ Deleted slider item #${index + 1}!`);
        } else {
            // Revert state if server action failed
            setImages(previousImages);
            setStatusMsg(`❌ ${res.message || "Failed to delete slider item."}`);
        }
    };

    // Reorder slides (Move Up / Down)
    const handleMoveSlide = async (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= images.length) return;

        const updated = [...images];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;

        setImages(updated);
        setStatusMsg("Saving new slider order to Database...");

        const res = await reorderHeroSlidesAction(updated);
        if (res.success && res.images) {
            setImages(res.images);
            setStatusMsg("✅ Slider queue order updated in Database!");
        }
    };

    const activeImageSrc = images[activePreviewIdx]?.src || images[0]?.src || "/hero/1.jpg";

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hero Section Manager</h1>
                    <p className="text-sm text-slate-500">Fast, instant load with item-by-item slider management and live text overlay controls</p>
                </div>
            </div>

            {statusMsg && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-between shadow-sm animate-fadeIn">
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
                        {textData.subtitle || "YOUR SUBTITLE HERE"}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-serif text-white font-light tracking-tight">
                        {textData.title || "YOUR MAIN TITLE"}
                    </h2>
                    <div className="w-12 h-0.5 bg-red-600 mx-auto" />
                    <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                        {textData.description || "Your hero description will appear here..."}
                    </p>
                    <div className="pt-2">
                        <span className="inline-block px-6 py-2 border border-white text-white text-xs tracking-widest uppercase font-sans rounded-md">
                            {textData.buttonText || "Button"} ({textData.buttonLink})
                        </span>
                    </div>
                </div>

                {/* Slider Image Dots Indicator */}
                {images.length > 0 && (
                    <div className="absolute bottom-3 z-10 flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
                        {images.map((_, idx) => (
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

            {/* 1. FIRST: TEXT OVERLAY CONTENT (Text Inputs) */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        ✏️ 1. Hero Text Overlay Content
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Subtitle */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Subtitle (Top Small Tag)</label>
                        <input
                            type="text"
                            required
                            value={textData.subtitle}
                            onChange={(e) => setTextData({ ...textData, subtitle: e.target.value })}
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
                            value={textData.title}
                            onChange={(e) => setTextData({ ...textData, title: e.target.value })}
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
                        value={textData.description}
                        onChange={(e) => setTextData({ ...textData, description: e.target.value })}
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
                            value={textData.buttonText}
                            onChange={(e) => setTextData({ ...textData, buttonText: e.target.value })}
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
                            value={textData.buttonLink}
                            onChange={(e) => setTextData({ ...textData, buttonLink: e.target.value })}
                            placeholder="e.g. #book-us or /contact"
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        />
                    </div>
                </div>
            </div>

            {/* 2. SECOND: IMAGE UPLOAD BOX */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        📤 2. Upload Slider Image(s)
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Select photo(s) to upload to Cloudinary and add to hero slider.</p>
                </div>

                <div className="p-8 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/20 hover:bg-amber-50/50 transition-all flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl shadow-sm">
                        📷
                    </div>

                    <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900">Upload New Hero Slider Images</h4>
                        <p className="text-xs text-slate-500 max-w-md">Each photo will be compressed, uploaded to Cloudinary, and added to the slider queue item-by-item.</p>
                    </div>

                    <label className="px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-sm cursor-pointer shadow-md transition-all flex items-center gap-2">
                        <span>{isUploading ? "Uploading & Adding..." : "➕ Click to Select & Upload Images"}</span>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleSliderImageUpload}
                            disabled={isUploading}
                        />
                    </label>
                </div>
            </div>

            {/* 3. THIRD: ACTIVE SLIDER QUEUE (3) - Item-by-Item Edit & Delete */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        🖼️ 3. Active Slider Queue ({images.length}) - Item-by-Item Edit & Delete
                    </h2>
                </div>

                {images.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {images.map((img, i) => (
                            <div
                                key={i}
                                className={`flex items-center gap-3 p-3.5 rounded-2xl border ${i === activePreviewIdx ? "border-amber-400 bg-amber-50/40 shadow-md" : "border-slate-200 bg-white"} shadow-sm transition-all`}
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
                                        onChange={(e) => handleLocalAltChange(i, e.target.value)}
                                        placeholder="ALT description..."
                                        className="w-full px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                    />
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <button
                                            type="button"
                                            disabled={savingItemIdx === i}
                                            onClick={() => handleSaveSingleSlide(i)}
                                            className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold"
                                            title="Save changes for this slide item"
                                        >
                                            {savingItemIdx === i ? "Saving..." : "💾 Save Item"}
                                        </button>

                                        <button
                                            type="button"
                                            disabled={i === 0}
                                            onClick={() => handleMoveSlide(i, "up")}
                                            className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 font-semibold"
                                        >
                                            ↑
                                        </button>
                                        <button
                                            type="button"
                                            disabled={i === images.length - 1}
                                            onClick={() => handleMoveSlide(i, "down")}
                                            className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 font-semibold"
                                        >
                                            ↓
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
                                    onClick={() => handleDeleteSingleSlide(i)}
                                    className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors flex-shrink-0 font-bold"
                                    title="Delete this slide item"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 text-slate-400 text-xs">
                        No background slider images found. Use the upload section above to add photos!
                    </div>
                )}
            </div>

            {/* 4. FOURTH: MAIN SAVE BUTTON AT THE VERY BOTTOM */}
            <div className="flex justify-end pt-4">
                <button
                    type="button"
                    onClick={() => handleSaveHeroText()}
                    disabled={isSavingText}
                    className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                    <span>{isSavingText ? "Saving Hero Text..." : "💾 Save Hero Text Overlay"}</span>
                </button>
            </div>
        </div>
    );
}
