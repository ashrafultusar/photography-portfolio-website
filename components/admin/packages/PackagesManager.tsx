"use client";

import { useState, useEffect, useTransition } from "react";
import {
    getPackagesPageAction,
    updatePackagesHeroSection,
    updatePricingSection,
    updateAddOnsSection,
} from "@/actions/packagesActions";
import {
    PackagesPageData,
    PackageItem,
    AddOnItem,
} from "@/lib/types/packages";
import { uploadToCloudinary } from "@/actions/portfolioActions";

// ─────────────────────────── types ───────────────────────────
type Tab = "hero" | "pricing" | "addons";
type Toast = { msg: string; ok: boolean } | null;

const ICON_OPTIONS = [
    { value: "zap", label: "⚡ Zap" },
    { value: "wind", label: "💨 Wind (Drone)" },
    { value: "clapperboard", label: "🎬 Clapperboard" },
    { value: "camera", label: "📷 Camera" },
    { value: "star", label: "⭐ Star" },
    { value: "heart", label: "❤️ Heart" },
];

const INPUT =
    "w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50";
const LABEL = "block text-xs font-medium text-slate-700 mb-1";
const SAVE_BTN =
    "px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200";

// ─────────────────────────── main component ───────────────────────────
export default function PackagesManager() {
    const [activeTab, setActiveTab] = useState<Tab>("hero");
    const [data, setData] = useState<PackagesPageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<Toast>(null);
    const [isPending, startTransition] = useTransition();

    // upload loading states
    const [uploadingHero, setUploadingHero] = useState(false);

    // local state per section
    const [hero, setHero] = useState({ eyebrow: "", heading: "", subtext: "", bgImage: "" });
    const [pricing, setPricing] = useState({
        sectionEyebrow: "",
        sectionHeading: "",
        sectionHeadingAccent: "",
        sectionDesc: "",
        noteText: "",
        packages: [] as PackageItem[],
    });
    const [addOns, setAddOns] = useState({
        sectionEyebrow: "",
        sectionHeading: "",
        sectionDesc: "",
        ctaNote: "",
        addOns: [] as AddOnItem[],
    });

    // modal state for pricing packages
    const [pkgModal, setPkgModal] = useState<{ open: boolean; idx: number | null }>({ open: false, idx: null });
    const [pkgForm, setPkgForm] = useState<PackageItem & { featuresInput: string }>({
        name: "", tagline: "", price: "", unit: "per event", featured: false, features: [], featuresInput: "",
    });

    // modal state for add-ons
    const [addonModal, setAddonModal] = useState<{ open: boolean; idx: number | null }>({ open: false, idx: null });
    const [addonForm, setAddonForm] = useState<AddOnItem>({
        icon: "star", title: "", desc: "", price: "",
    });

    useEffect(() => {
        getPackagesPageAction().then((d) => {
            setData(d);
            setHero(d.heroSection);
            setPricing(d.pricingSection);
            setAddOns(d.addOnsSection);
            setLoading(false);
        });
    }, []);

    const showToast = (msg: string, ok: boolean) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3500);
    };

    // ──── Hero Save ────
    const saveHero = () => {
        startTransition(async () => {
            const res = await updatePackagesHeroSection(hero);
            showToast(res.message, res.success);
        });
    };

    // ──── Pricing Save ────
    const savePricing = () => {
        startTransition(async () => {
            const res = await updatePricingSection(pricing);
            showToast(res.message, res.success);
        });
    };

    // ──── AddOns Save ────
    const saveAddOns = () => {
        startTransition(async () => {
            const res = await updateAddOnsSection(addOns);
            showToast(res.message, res.success);
        });
    };

    const handleImageUpload = async (
        file: File,
        onSuccess: (url: string) => void,
        setUploading: (u: boolean) => void
    ) => {
        if (!file) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await uploadToCloudinary(fd);
            if (res.success && res.urls && res.urls.length > 0) {
                onSuccess(res.urls[0]);
                showToast("Image uploaded successfully!", true);
            } else {
                showToast(res.error || "Failed to upload image.", false);
            }
        } catch (err: any) {
            console.error(err);
            showToast("Upload failed.", false);
        } finally {
            setUploading(false);
        }
    };

    // ──── Package modal helpers ────
    const openAddPkg = () => {
        setPkgForm({ name: "", tagline: "", price: "৳ ", unit: "per event", featured: false, features: [], featuresInput: "" });
        setPkgModal({ open: true, idx: null });
    };
    const openEditPkg = (idx: number) => {
        const p = pricing.packages[idx];
        setPkgForm({ ...p, featuresInput: p.features.join("\n") });
        setPkgModal({ open: true, idx });
    };
    const deletePkg = (idx: number) => {
        if (!confirm("Delete this package?")) return;
        setPricing((prev) => ({ ...prev, packages: prev.packages.filter((_, i) => i !== idx) }));
    };
    const savePkgModal = () => {
        const feats = pkgForm.featuresInput.split("\n").map((f) => f.trim()).filter(Boolean);
        const pkg: PackageItem = { name: pkgForm.name, tagline: pkgForm.tagline, price: pkgForm.price, unit: pkgForm.unit, featured: pkgForm.featured, features: feats };
        setPricing((prev) => {
            const pkgs = [...prev.packages];
            if (pkgModal.idx !== null) pkgs[pkgModal.idx] = pkg;
            else pkgs.push(pkg);
            return { ...prev, packages: pkgs };
        });
        setPkgModal({ open: false, idx: null });
    };

    // ──── Add-On modal helpers ────
    const openAddAddon = () => {
        setAddonForm({ icon: "star", title: "", desc: "", price: "৳" });
        setAddonModal({ open: true, idx: null });
    };
    const openEditAddon = (idx: number) => {
        setAddonForm({ ...addOns.addOns[idx] });
        setAddonModal({ open: true, idx });
    };
    const deleteAddon = (idx: number) => {
        if (!confirm("Delete this add-on?")) return;
        setAddOns((prev) => ({ ...prev, addOns: prev.addOns.filter((_, i) => i !== idx) }));
    };
    const saveAddonModal = () => {
        setAddOns((prev) => {
            const items = [...prev.addOns];
            if (addonModal.idx !== null) items[addonModal.idx] = addonForm;
            else items.push(addonForm);
            return { ...prev, addOns: items };
        });
        setAddonModal({ open: false, idx: null });
    };

    // ─────────────────────────── render ───────────────────────────
    if (loading) {
        return (
            <div className="flex items-center justify-center h-48">
                <div className="w-6 h-6 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            </div>
        );
    }

    const tabs: { id: Tab; label: string }[] = [
        { id: "hero", label: "Page Hero" },
        { id: "pricing", label: "Pricing Packages" },
        { id: "addons", label: "Add-Ons" },
    ];

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Packages & Pricing</h1>
                <p className="text-sm text-slate-500">Manage every section of the /packages page independently</p>
            </div>

            {/* Toast */}
            {toast && (
                <div className={`fixed top-5 right-5 z-[9999] px-5 py-3 rounded-2xl text-sm font-semibold shadow-xl border transition-all ${toast.ok ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-700"}`}>
                    {toast.ok ? "✅" : "❌"} {toast.msg}
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl w-fit">
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === t.id ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ════════════ TAB: PAGE HERO ════════════ */}
            {activeTab === "hero" && (
                <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-5 shadow-sm">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Page Hero Section</h2>
                            <p className="text-xs text-slate-400">The banner shown at the top of /packages</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={LABEL}>Eyebrow Text</label>
                            <input className={INPUT} value={hero.eyebrow} onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })} placeholder="Pricing" />
                        </div>
                        <div>
                            <label className={LABEL}>Heading</label>
                            <input className={INPUT} value={hero.heading} onChange={(e) => setHero({ ...hero, heading: e.target.value })} placeholder="Our Packages" />
                        </div>
                    </div>
                    <div>
                        <label className={LABEL}>Subtext / Description</label>
                        <input className={INPUT} value={hero.subtext} onChange={(e) => setHero({ ...hero, subtext: e.target.value })} placeholder="Transparent pricing..." />
                    </div>
                    <div>
                        <label className={LABEL}>Background Image Path</label>
                        <div className="flex gap-3">
                            <input className={INPUT + " flex-1"} value={hero.bgImage} onChange={(e) => setHero({ ...hero, bgImage: e.target.value })} placeholder="/hero/4.jpg" />
                            <label className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-sm flex items-center justify-center shrink-0 min-w-[120px]">
                                {uploadingHero ? "Uploading..." : "Upload Image"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={uploadingHero}
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            await handleImageUpload(file, (url) => setHero(prev => ({ ...prev, bgImage: url })), setUploadingHero);
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        {hero.bgImage && (
                            <div className="mt-3 relative w-40 h-24 rounded-xl overflow-hidden border border-slate-200">
                                <img src={hero.bgImage} alt="Hero Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button onClick={saveHero} disabled={isPending} className={SAVE_BTN}>
                            {isPending ? "Saving…" : "Save Page Hero"}
                        </button>
                    </div>
                </div>
            )}

            {/* ════════════ TAB: PRICING ════════════ */}
            {activeTab === "pricing" && (
                <div className="space-y-6">
                    {/* Section header settings */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 shadow-sm">
                        <div className="pb-4 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900">Section Header</h2>
                            <p className="text-xs text-slate-400">Text shown above the package cards</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className={LABEL}>Eyebrow Label</label>
                                <input className={INPUT} value={pricing.sectionEyebrow} onChange={(e) => setPricing({ ...pricing, sectionEyebrow: e.target.value })} placeholder="Investment" />
                            </div>
                            <div>
                                <label className={LABEL}>Heading</label>
                                <input className={INPUT} value={pricing.sectionHeading} onChange={(e) => setPricing({ ...pricing, sectionHeading: e.target.value })} placeholder="Choose Your" />
                            </div>
                            <div>
                                <label className={LABEL}>Heading Accent (highlighted word)</label>
                                <input className={INPUT} value={pricing.sectionHeadingAccent} onChange={(e) => setPricing({ ...pricing, sectionHeadingAccent: e.target.value })} placeholder="Story" />
                            </div>
                        </div>
                        <div>
                            <label className={LABEL}>Section Description</label>
                            <input className={INPUT} value={pricing.sectionDesc} onChange={(e) => setPricing({ ...pricing, sectionDesc: e.target.value })} />
                        </div>
                        <div>
                            <label className={LABEL}>Bottom Note Text</label>
                            <input className={INPUT} value={pricing.noteText} onChange={(e) => setPricing({ ...pricing, noteText: e.target.value })} placeholder="Need something custom? Let's talk." />
                        </div>
                    </div>

                    {/* Package cards */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Package Cards</h2>
                                <p className="text-xs text-slate-400">{pricing.packages.length} packages configured</p>
                            </div>
                            <button onClick={openAddPkg} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-all shadow-sm">
                                + Add Package
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {pricing.packages.map((pkg, idx) => (
                                <div key={idx} className={`relative rounded-2xl p-6 border flex flex-col bg-white shadow-sm ${pkg.featured ? "border-amber-400 ring-2 ring-amber-400/20" : "border-slate-200"}`}>
                                    {pkg.featured && (
                                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold uppercase">Most Popular</span>
                                    )}
                                    <div className="mb-3">
                                        <h3 className="text-base font-bold text-slate-900">{pkg.name}</h3>
                                        <p className="text-xs text-slate-400">{pkg.tagline}</p>
                                        <p className="text-2xl font-extrabold text-slate-900 mt-2">{pkg.price}</p>
                                        <p className="text-xs text-slate-400">{pkg.unit}</p>
                                    </div>
                                    <ul className="space-y-1 text-xs text-slate-600 flex-1">
                                        {pkg.features.map((f, i) => <li key={i} className="flex items-start gap-1.5"><span className="text-amber-500 mt-0.5">✓</span>{f}</li>)}
                                    </ul>
                                    <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
                                        <button onClick={() => openEditPkg(idx)} className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors">Edit</button>
                                        <button onClick={() => deletePkg(idx)} className="py-2 px-3 rounded-xl text-red-500 hover:bg-red-50 text-xs font-medium transition-colors">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {pricing.packages.length === 0 && (
                            <p className="text-center text-slate-400 text-sm py-10">No packages yet. Click &quot;+ Add Package&quot; to create one.</p>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button onClick={savePricing} disabled={isPending} className={SAVE_BTN}>
                            {isPending ? "Saving…" : "Save Pricing Section"}
                        </button>
                    </div>
                </div>
            )}

            {/* ════════════ TAB: ADD-ONS ════════════ */}
            {activeTab === "addons" && (
                <div className="space-y-6">
                    {/* Section header settings */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 shadow-sm">
                        <div className="pb-4 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900">Section Header</h2>
                            <p className="text-xs text-slate-400">Text shown above the add-on cards</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={LABEL}>Eyebrow Label</label>
                                <input className={INPUT} value={addOns.sectionEyebrow} onChange={(e) => setAddOns({ ...addOns, sectionEyebrow: e.target.value })} placeholder="Customize" />
                            </div>
                            <div>
                                <label className={LABEL}>Section Heading</label>
                                <input className={INPUT} value={addOns.sectionHeading} onChange={(e) => setAddOns({ ...addOns, sectionHeading: e.target.value })} placeholder="Enhance Your Experience" />
                            </div>
                        </div>
                        <div>
                            <label className={LABEL}>Section Description</label>
                            <input className={INPUT} value={addOns.sectionDesc} onChange={(e) => setAddOns({ ...addOns, sectionDesc: e.target.value })} />
                        </div>
                        <div>
                            <label className={LABEL}>CTA Note (bottom text)</label>
                            <input className={INPUT} value={addOns.ctaNote} onChange={(e) => setAddOns({ ...addOns, ctaNote: e.target.value })} />
                        </div>
                    </div>

                    {/* Add-on cards */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Add-On Cards</h2>
                                <p className="text-xs text-slate-400">{addOns.addOns.length} add-ons configured</p>
                            </div>
                            <button onClick={openAddAddon} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-all shadow-sm">
                                + Add Add-On
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {addOns.addOns.map((item, idx) => (
                                <div key={idx} className="rounded-2xl border border-slate-200 p-5 text-center space-y-2 bg-white shadow-sm hover:border-amber-300 transition-colors">
                                    <p className="text-2xl">{ICON_OPTIONS.find(i => i.value === item.icon)?.label.split(" ")[0] || "⭐"}</p>
                                    <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                                    <p className="text-xs text-slate-400">{item.desc}</p>
                                    <p className="text-lg font-bold text-amber-500">{item.price}</p>
                                    <div className="flex gap-2 pt-2 border-t border-slate-100">
                                        <button onClick={() => openEditAddon(idx)} className="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors">Edit</button>
                                        <button onClick={() => deleteAddon(idx)} className="py-1.5 px-3 rounded-xl text-red-500 hover:bg-red-50 text-xs font-medium transition-colors">Del</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {addOns.addOns.length === 0 && (
                            <p className="text-center text-slate-400 text-sm py-10">No add-ons yet. Click &quot;+ Add Add-On&quot; to create one.</p>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button onClick={saveAddOns} disabled={isPending} className={SAVE_BTN}>
                            {isPending ? "Saving…" : "Save Add-Ons Section"}
                        </button>
                    </div>
                </div>
            )}

            {/* ════════════ MODAL: Package ════════════ */}
            {pkgModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-8 shadow-2xl my-8 text-slate-900">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <h2 className="text-xl font-bold">{pkgModal.idx !== null ? "Edit Package" : "Add New Package"}</h2>
                            <button onClick={() => setPkgModal({ open: false, idx: null })} className="p-2 text-slate-400 hover:text-slate-900 text-lg">✕</button>
                        </div>
                        <div className="space-y-4 mt-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={LABEL}>Package Name</label>
                                    <input className={INPUT} value={pkgForm.name} onChange={(e) => setPkgForm({ ...pkgForm, name: e.target.value })} placeholder="Silver" />
                                </div>
                                <div>
                                    <label className={LABEL}>Price</label>
                                    <input className={INPUT} value={pkgForm.price} onChange={(e) => setPkgForm({ ...pkgForm, price: e.target.value })} placeholder="৳ 25,000" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={LABEL}>Tagline</label>
                                    <input className={INPUT} value={pkgForm.tagline} onChange={(e) => setPkgForm({ ...pkgForm, tagline: e.target.value })} placeholder="Perfect for intimate moments" />
                                </div>
                                <div>
                                    <label className={LABEL}>Unit</label>
                                    <input className={INPUT} value={pkgForm.unit} onChange={(e) => setPkgForm({ ...pkgForm, unit: e.target.value })} placeholder="per event" />
                                </div>
                            </div>
                            <div>
                                <label className={LABEL}>Features (one per line)</label>
                                <textarea
                                    rows={5}
                                    className={INPUT + " font-mono resize-none"}
                                    value={pkgForm.featuresInput}
                                    onChange={(e) => setPkgForm({ ...pkgForm, featuresInput: e.target.value })}
                                    placeholder={"6 Hours Coverage\n200+ Edited Photos\nOnline Gallery"}
                                />
                            </div>
                            <div className="flex items-center gap-3 py-2">
                                <input type="checkbox" id="featured" checked={pkgForm.featured} onChange={(e) => setPkgForm({ ...pkgForm, featured: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500" />
                                <label htmlFor="featured" className="text-xs text-slate-700 font-medium">Mark as &quot;Most Popular&quot;</label>
                            </div>
                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                                <button type="button" onClick={() => setPkgModal({ open: false, idx: null })} className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold">Cancel</button>
                                <button type="button" onClick={savePkgModal} className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold shadow-sm">
                                    {pkgModal.idx !== null ? "Update Package" : "Add Package"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ════════════ MODAL: Add-On ════════════ */}
            {addonModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-8 shadow-2xl my-8 text-slate-900">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <h2 className="text-xl font-bold">{addonModal.idx !== null ? "Edit Add-On" : "Add New Add-On"}</h2>
                            <button onClick={() => setAddonModal({ open: false, idx: null })} className="p-2 text-slate-400 hover:text-slate-900 text-lg">✕</button>
                        </div>
                        <div className="space-y-4 mt-6">
                            <div>
                                <label className={LABEL}>Icon</label>
                                <select className={INPUT} value={addonForm.icon} onChange={(e) => setAddonForm({ ...addonForm, icon: e.target.value })}>
                                    {ICON_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={LABEL}>Title</label>
                                    <input className={INPUT} value={addonForm.title} onChange={(e) => setAddonForm({ ...addonForm, title: e.target.value })} placeholder="Express Delivery" />
                                </div>
                                <div>
                                    <label className={LABEL}>Price</label>
                                    <input className={INPUT} value={addonForm.price} onChange={(e) => setAddonForm({ ...addonForm, price: e.target.value })} placeholder="৳10,000" />
                                </div>
                            </div>
                            <div>
                                <label className={LABEL}>Description</label>
                                <input className={INPUT} value={addonForm.desc} onChange={(e) => setAddonForm({ ...addonForm, desc: e.target.value })} placeholder="Delivery within 7 days" />
                            </div>
                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                                <button type="button" onClick={() => setAddonModal({ open: false, idx: null })} className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold">Cancel</button>
                                <button type="button" onClick={saveAddonModal} className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold shadow-sm">
                                    {addonModal.idx !== null ? "Update Add-On" : "Add Add-On"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
