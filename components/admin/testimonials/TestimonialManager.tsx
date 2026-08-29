"use client";

import { useState, useEffect } from "react";
import {
    getTestimonialsContentAction,
    createTestimonialAction,
    updateTestimonialAction,
    deleteTestimonialAction,
    reorderTestimonialsAction,
} from "@/actions/testimonialActions";
import { TestimonialItem } from "@/lib/types/testimonial";

interface TestimonialManagerProps {
    initialData?: TestimonialItem[];
}

export default function TestimonialManager({ initialData }: TestimonialManagerProps) {
    const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialData || []);
    const [loading, setLoading] = useState(!initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [statusMsg, setStatusMsg] = useState<string | null>(null);

    // Form Modal state
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        role: "Wedding Client",
        image: "/hero/1.jpg",
        rating: 5,
        comment: "",
        isActive: true,
    });

    useEffect(() => {
        if (initialData) {
            setLoading(false);
            return;
        }
        getTestimonialsContentAction().then((items) => {
            setTestimonials(items || []);
            setLoading(false);
        });
    }, [initialData]);

    const openAddModal = () => {
        setEditingItem(null);
        setFormData({
            name: "",
            role: "Wedding Client",
            image: "/hero/1.jpg",
            rating: 5,
            comment: "",
            isActive: true,
        });
        setShowForm(true);
    };

    const openEditModal = (item: TestimonialItem) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            role: item.role || "Happy Client",
            image: item.image,
            rating: item.rating || 5,
            comment: item.comment,
            isActive: item.isActive ?? true,
        });
        setShowForm(true);
    };

    // Direct Cloudinary avatar upload
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        setStatusMsg("Uploading client photo to Cloudinary...");

        const { uploadImagesDirectToCloudinary } = await import("@/lib/uploadClient");
        const uploadRes = await uploadImagesDirectToCloudinary(Array.from(files));

        if (uploadRes.success && uploadRes.urls.length > 0) {
            setFormData((prev) => ({ ...prev, image: uploadRes.urls[0] }));
            setStatusMsg("✅ Avatar photo uploaded!");
        } else {
            setStatusMsg(`❌ ${uploadRes.errors?.join(", ") || "Upload failed."}`);
        }
        setIsUploading(false);
    };

    // Save (Create or Update)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.comment) {
            setStatusMsg("❌ Name and Comment are required.");
            return;
        }

        setIsSaving(true);
        setStatusMsg(editingItem ? "Updating testimonial..." : "Creating new testimonial...");

        if (editingItem && editingItem._id) {
            const res = await updateTestimonialAction(editingItem._id, formData);
            if (res.success && res.item) {
                setTestimonials((prev) =>
                    prev.map((t) => (t._id === editingItem._id ? res.item : t))
                );
                setStatusMsg("✅ Testimonial updated!");
                setShowForm(false);
            } else {
                setStatusMsg(`❌ ${res.message}`);
            }
        } else {
            const res = await createTestimonialAction(formData);
            if (res.success && res.item) {
                setTestimonials((prev) => [res.item, ...prev]);
                setStatusMsg("✅ Testimonial created!");
                setShowForm(false);
            } else {
                setStatusMsg(`❌ ${res.message}`);
            }
        }

        setIsSaving(false);
    };

    // Delete
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;

        const previous = [...testimonials];
        setTestimonials((prev) => prev.filter((t) => t._id !== id));
        setStatusMsg("Deleting testimonial...");

        const res = await deleteTestimonialAction(id);
        if (res.success) {
            setStatusMsg("✅ Testimonial deleted!");
        } else {
            setTestimonials(previous);
            setStatusMsg(`❌ ${res.message}`);
        }
    };

    // Toggle Active Status
    const handleToggleActive = async (item: TestimonialItem) => {
        if (!item._id) return;
        const newStatus = !item.isActive;

        setTestimonials((prev) =>
            prev.map((t) => (t._id === item._id ? { ...t, isActive: newStatus } : t))
        );

        const res = await updateTestimonialAction(item._id, { isActive: newStatus });
        if (res.success) {
            setStatusMsg(`✅ Testimonial set to ${newStatus ? "Active" : "Inactive"}`);
        }
    };

    // Reorder (Move up / down)
    const handleMove = async (index: number, direction: "up" | "down") => {
        const targetIdx = direction === "up" ? index - 1 : index + 1;
        if (targetIdx < 0 || targetIdx >= testimonials.length) return;

        const updated = [...testimonials];
        const temp = updated[index];
        updated[index] = updated[targetIdx];
        updated[targetIdx] = temp;

        setTestimonials(updated);
        setStatusMsg("Saving new order...");

        const res = await reorderTestimonialsAction(updated);
        if (res.success) {
            setStatusMsg("✅ Order saved!");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48">
                <div className="w-6 h-6 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Testimonials Manager</h1>
                    <p className="text-sm text-slate-500">Manage client reviews, star ratings, and avatars for the homepage infinite slider.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                >
                    <span>➕ Add New Testimonial</span>
                </button>
            </div>

            {statusMsg && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-between shadow-sm animate-fadeIn">
                    <span>{statusMsg}</span>
                    <button onClick={() => setStatusMsg(null)} className="text-amber-700 hover:text-amber-950 font-bold ml-4">✕</button>
                </div>
            )}

            {/* Testimonials Grid / List */}
            {testimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {testimonials.map((item, idx) => (
                        <div
                            key={item._id || idx}
                            className={`p-6 rounded-3xl border ${item.isActive ? "border-slate-200 bg-white shadow-sm" : "border-slate-200/60 bg-slate-50 opacity-60"} space-y-4 flex flex-col justify-between transition-all`}
                        >
                            <div className="space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-sm shrink-0"
                                        />
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-base leading-tight">{item.name}</h3>
                                            <p className="text-xs text-slate-500 font-medium">{item.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-amber-400 text-sm tracking-tighter">
                                        {"★".repeat(item.rating || 5)}
                                    </div>
                                </div>

                                <p className="text-slate-700 text-sm italic leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                                    "{item.comment}"
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        disabled={idx === 0}
                                        onClick={() => handleMove(idx, "up")}
                                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 font-semibold cursor-pointer"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        type="button"
                                        disabled={idx === testimonials.length - 1}
                                        onClick={() => handleMove(idx, "down")}
                                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 font-semibold cursor-pointer"
                                    >
                                        ↓
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleToggleActive(item)}
                                        className={`text-xs px-3 py-1 rounded-lg font-bold cursor-pointer ${item.isActive ? "bg-emerald-100 text-emerald-900 hover:bg-emerald-200" : "bg-slate-200 text-slate-700"}`}
                                    >
                                        {item.isActive ? "Active" : "Hidden"}
                                    </button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => openEditModal(item)}
                                        className="text-xs px-3.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold transition-all cursor-pointer"
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => item._id && handleDelete(item._id)}
                                        className="text-xs px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold transition-all cursor-pointer"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                    <p className="text-slate-500 text-sm">No testimonials found.</p>
                    <button
                        onClick={openAddModal}
                        className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-sm shadow-md"
                    >
                        Create First Testimonial
                    </button>
                </div>
            )}

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <h2 className="text-lg font-bold text-slate-900">
                                {editingItem ? "✏️ Edit Testimonial" : "➕ Add New Testimonial"}
                            </h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Client Image Preview & Upload */}
                            <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                                <img
                                    src={formData.image}
                                    alt="Avatar Preview"
                                    className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shadow-sm shrink-0"
                                />
                                <div className="space-y-1 flex-1 min-w-0">
                                    <label className="block text-xs font-bold text-slate-800">Client Avatar Photo</label>
                                    <label className="inline-block px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer shadow-sm transition-all">
                                        <span>{isUploading ? "Uploading..." : "📷 Upload Photo"}</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleAvatarUpload}
                                            disabled={isUploading}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Client Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Tanvir & Nabila"
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                />
                            </div>

                            {/* Role / Event Type */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Role / Event Type</label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    placeholder="e.g. Wedding Client or Holud & Reception"
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                />
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Star Rating (1 - 5)</label>
                                <select
                                    value={formData.rating}
                                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-bold text-amber-500"
                                >
                                    <option value={5}>★★★★★ (5 Stars)</option>
                                    <option value={4}>★★★★☆ (4 Stars)</option>
                                    <option value={3}>★★★☆☆ (3 Stars)</option>
                                    <option value={2}>★★☆☆☆ (2 Stars)</option>
                                    <option value={1}>★☆☆☆☆ (1 Star)</option>
                                </select>
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Testimonial Review Comment *</label>
                                <textarea
                                    rows={4}
                                    required
                                    value={formData.comment}
                                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                    placeholder="Write client quote or feedback review..."
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                />
                            </div>

                            {/* Active Toggle */}
                            <div className="flex items-center gap-2 pt-1">
                                <input
                                    type="checkbox"
                                    id="isActiveCheckbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer"
                                />
                                <label htmlFor="isActiveCheckbox" className="text-xs font-semibold text-slate-700 cursor-pointer">
                                    Show on homepage slider (Active)
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-sm shadow-md disabled:opacity-50"
                                >
                                    {isSaving ? "Saving..." : editingItem ? "Update Testimonial" : "Create Testimonial"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
