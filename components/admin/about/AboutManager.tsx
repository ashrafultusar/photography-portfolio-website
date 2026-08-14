"use client";

import { useState, useEffect, useTransition } from "react";
import {
    getAboutPageAction,
    updateHomeAboutSection,
    updateAboutHeroSection,
    updateCompanyStory,
    updateTeamSection,
    updateStatsSection,
    updateWhyChooseUs,
} from "@/actions/aboutActions";
import { AboutPageData, HomeAboutData, HomeAboutStat, StoryItem, TeamMember, StatItem, WhyItem } from "@/lib/types/about";
import { uploadToCloudinary } from "@/actions/portfolioActions";

// ─── constants ───
type Tab = "home" | "hero" | "story" | "team" | "stats" | "why";
type Toast = { msg: string; ok: boolean } | null;

const ICON_OPTIONS = [
    { value: "camera", label: "📷 Camera" },
    { value: "film", label: "🎬 Film" },
    { value: "heart", label: "❤️ Heart" },
    { value: "award", label: "🏆 Award" },
    { value: "clock", label: "⏰ Clock" },
    { value: "map-pin", label: "📍 Map Pin" },
    { value: "star", label: "⭐ Star" },
    { value: "users", label: "👥 Users" },
];

const INPUT = "w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50";
const LABEL = "block text-xs font-medium text-slate-700 mb-1";
const SAVE_BTN = "px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200";
const CARD = "bg-white border border-slate-200 rounded-3xl p-8 shadow-sm";

export default function AboutManager() {
    const [activeTab, setActiveTab] = useState<Tab>("home");
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<Toast>(null);
    const [isPending, startTransition] = useTransition();

    // upload loading states
    const [uploadingHomeImg1, setUploadingHomeImg1] = useState(false);
    const [uploadingHomeImg2, setUploadingHomeImg2] = useState(false);
    const [uploadingHero, setUploadingHero] = useState(false);
    const [uploadingStory, setUploadingStory] = useState(false);
    const [uploadingMember, setUploadingMember] = useState(false);

    // section states
    const [home, setHome] = useState<HomeAboutData>({
        eyebrow: "", heading: "", description1: "", description2: "", sinceYear: "", image1: "", image2: "", stats: [], ctaText: "", ctaLink: ""
    });
    const [hero, setHero] = useState({ eyebrow: "", heading: "", subtext: "", bgImage: "" });
    const [story, setStory] = useState({ eyebrow: "", heading: "", image: "", items: [] as StoryItem[] });
    const [team, setTeam] = useState({ eyebrow: "", heading: "", members: [] as TeamMember[] });
    const [stats, setStats] = useState({ eyebrow: "", heading: "", stats: [] as StatItem[] });
    const [why, setWhy] = useState({ eyebrow: "", heading: "", items: [] as WhyItem[] });

    // modals
    const [homeStatModal, setHomeStatModal] = useState<{ open: boolean; idx: number | null }>({ open: false, idx: null });
    const [homeStatForm, setHomeStatForm] = useState<HomeAboutStat>({ icon: "camera", value: "", label: "" });
    const [storyModal, setStoryModal] = useState<{ open: boolean; idx: number | null }>({ open: false, idx: null });
    const [storyForm, setStoryForm] = useState<StoryItem>({ label: "", text: "" });
    const [memberModal, setMemberModal] = useState<{ open: boolean; idx: number | null }>({ open: false, idx: null });
    const [memberForm, setMemberForm] = useState<TeamMember>({ name: "", role: "", image: "", bio: "" });
    const [statModal, setStatModal] = useState<{ open: boolean; idx: number | null }>({ open: false, idx: null });
    const [statForm, setStatForm] = useState<StatItem>({ value: 0, suffix: "+", label: "" });
    const [whyModal, setWhyModal] = useState<{ open: boolean; idx: number | null }>({ open: false, idx: null });
    const [whyForm, setWhyForm] = useState<WhyItem>({ icon: "star", title: "", desc: "" });

    useEffect(() => {
        getAboutPageAction().then((d: AboutPageData) => {
            if (d.homeSection) setHome(d.homeSection);
            setHero(d.heroSection);
            setStory(d.companyStory);
            setTeam(d.teamSection);
            setStats(d.statsSection);
            setWhy(d.whyChooseUs);
            setLoading(false);
        });
    }, []);

    const showToast = (msg: string, ok: boolean) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3500);
    };

    const saveHome = () => startTransition(async () => { const r = await updateHomeAboutSection(home); showToast(r.message, r.success); });
    const saveHero = () => startTransition(async () => { const r = await updateAboutHeroSection(hero); showToast(r.message, r.success); });
    const saveStory = () => startTransition(async () => { const r = await updateCompanyStory(story); showToast(r.message, r.success); });
    const saveTeam = () => startTransition(async () => { const r = await updateTeamSection(team); showToast(r.message, r.success); });
    const saveStats = () => startTransition(async () => { const r = await updateStatsSection(stats); showToast(r.message, r.success); });
    const saveWhy = () => startTransition(async () => { const r = await updateWhyChooseUs(why); showToast(r.message, r.success); });

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

    // home stat helpers
    const openAddHomeStat = () => { setHomeStatForm({ icon: "camera", value: "", label: "" }); setHomeStatModal({ open: true, idx: null }); };
    const openEditHomeStat = (i: number) => { setHomeStatForm({ ...home.stats[i] }); setHomeStatModal({ open: true, idx: i }); };
    const deleteHomeStat = (i: number) => { if (!confirm("Delete stat card?")) return; setHome(p => ({ ...p, stats: p.stats.filter((_, j) => j !== i) })); };
    const saveHomeStatModal = () => {
        setHome(p => { const arr = [...(p.stats || [])]; if (homeStatModal.idx !== null) arr[homeStatModal.idx] = homeStatForm; else arr.push(homeStatForm); return { ...p, stats: arr }; });
        setHomeStatModal({ open: false, idx: null });
    };

    // story helpers
    const openAddStory = () => { setStoryForm({ label: "", text: "" }); setStoryModal({ open: true, idx: null }); };
    const openEditStory = (i: number) => { setStoryForm({ ...story.items[i] }); setStoryModal({ open: true, idx: i }); };
    const deleteStory = (i: number) => { if (!confirm("Delete?")) return; setStory(p => ({ ...p, items: p.items.filter((_, j) => j !== i) })); };
    const saveStoryModal = () => {
        setStory(p => { const arr = [...p.items]; if (storyModal.idx !== null) arr[storyModal.idx] = storyForm; else arr.push(storyForm); return { ...p, items: arr }; });
        setStoryModal({ open: false, idx: null });
    };

    // team helpers
    const openAddMember = () => { setMemberForm({ name: "", role: "", image: "", bio: "" }); setMemberModal({ open: true, idx: null }); };
    const openEditMember = (i: number) => { setMemberForm({ ...team.members[i] }); setMemberModal({ open: true, idx: i }); };
    const deleteMember = (i: number) => { if (!confirm("Delete?")) return; setTeam(p => ({ ...p, members: p.members.filter((_, j) => j !== i) })); };
    const saveMemberModal = () => {
        setTeam(p => { const arr = [...p.members]; if (memberModal.idx !== null) arr[memberModal.idx] = memberForm; else arr.push(memberForm); return { ...p, members: arr }; });
        setMemberModal({ open: false, idx: null });
    };

    // stat helpers
    const openAddStat = () => { setStatForm({ value: 0, suffix: "+", label: "" }); setStatModal({ open: true, idx: null }); };
    const openEditStat = (i: number) => { setStatForm({ ...stats.stats[i] }); setStatModal({ open: true, idx: i }); };
    const deleteStat = (i: number) => { if (!confirm("Delete?")) return; setStats(p => ({ ...p, stats: p.stats.filter((_, j) => j !== i) })); };
    const saveStatModal = () => {
        setStats(p => { const arr = [...p.stats]; if (statModal.idx !== null) arr[statModal.idx] = statForm; else arr.push(statForm); return { ...p, stats: arr }; });
        setStatModal({ open: false, idx: null });
    };

    // why helpers
    const openAddWhy = () => { setWhyForm({ icon: "star", title: "", desc: "" }); setWhyModal({ open: true, idx: null }); };
    const openEditWhy = (i: number) => { setWhyForm({ ...why.items[i] }); setWhyModal({ open: true, idx: i }); };
    const deleteWhy = (i: number) => { if (!confirm("Delete?")) return; setWhy(p => ({ ...p, items: p.items.filter((_, j) => j !== i) })); };
    const saveWhyModal = () => {
        setWhy(p => { const arr = [...p.items]; if (whyModal.idx !== null) arr[whyModal.idx] = whyForm; else arr.push(whyForm); return { ...p, items: arr }; });
        setWhyModal({ open: false, idx: null });
    };

    if (loading) return (
        <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
        </div>
    );

    const tabs: { id: Tab; label: string }[] = [
        { id: "home", label: "Homepage About" },
        { id: "hero", label: "Page Hero" },
        { id: "story", label: "Our Story" },
        { id: "team", label: "Team" },
        { id: "stats", label: "Stats" },
        { id: "why", label: "Why Choose Us" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">About Page Management</h1>
                <p className="text-sm text-slate-500">Manage every section of the /about page independently</p>
            </div>

            {toast && (
                <div className={`fixed top-5 right-5 z-[9999] px-5 py-3 rounded-2xl text-sm font-semibold shadow-xl border ${toast.ok ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-700"}`}>
                    {toast.ok ? "✅" : "❌"} {toast.msg}
                </div>
            )}

            {/* Tabs */}
            <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-2xl w-fit">
                {tabs.map((t) => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === t.id ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ══ TAB: HOMEPAGE ABOUT ══ */}
            {activeTab === "home" && (
                <div className="space-y-6">
                    {/* Header & Text Content */}
                    <div className={CARD + " space-y-5"}>
                        <div className="pb-4 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900">Homepage About Section Content</h2>
                            <p className="text-xs text-slate-400">Manage heading, descriptions, and badge for the About section on the main homepage</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className={LABEL}>Eyebrow (e.g. Our Story)</label><input className={INPUT} value={home.eyebrow} onChange={e => setHome({ ...home, eyebrow: e.target.value })} /></div>
                            <div><label className={LABEL}>Heading</label><input className={INPUT} value={home.heading} onChange={e => setHome({ ...home, heading: e.target.value })} /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={LABEL}>Primary Description</label>
                                <textarea rows={4} className={INPUT + " resize-none"} value={home.description1} onChange={e => setHome({ ...home, description1: e.target.value })} />
                            </div>
                            <div>
                                <label className={LABEL}>Secondary Description</label>
                                <textarea rows={4} className={INPUT + " resize-none"} value={home.description2} onChange={e => setHome({ ...home, description2: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div><label className={LABEL}>&quot;Since&quot; Year Badge (e.g. 2016)</label><input className={INPUT} value={home.sinceYear} onChange={e => setHome({ ...home, sinceYear: e.target.value })} /></div>
                            <div><label className={LABEL}>CTA Button Text (e.g. Meet Our Team)</label><input className={INPUT} value={home.ctaText} onChange={e => setHome({ ...home, ctaText: e.target.value })} /></div>
                            <div><label className={LABEL}>CTA Button Link (e.g. /about)</label><input className={INPUT} value={home.ctaLink} onChange={e => setHome({ ...home, ctaLink: e.target.value })} /></div>
                        </div>
                    </div>

                    {/* Section Images */}
                    <div className={CARD + " space-y-5"}>
                        <div className="pb-4 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900">Section Images</h2>
                            <p className="text-xs text-slate-400">Upload or change the primary large image and secondary small image</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Image 1 */}
                            <div className="space-y-2">
                                <label className={LABEL}>Large Image (Primary)</label>
                                <div className="flex gap-3">
                                    <input className={INPUT + " flex-1"} value={home.image1} onChange={e => setHome({ ...home, image1: e.target.value })} placeholder="/hero/1.jpg" />
                                    <label className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-sm flex items-center justify-center shrink-0 min-w-[120px]">
                                        {uploadingHomeImg1 ? "Uploading..." : "Upload Image"}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            disabled={uploadingHomeImg1}
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    await handleImageUpload(file, (url) => setHome(prev => ({ ...prev, image1: url })), setUploadingHomeImg1);
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                                {home.image1 && (
                                    <div className="mt-3 relative w-48 h-32 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                                        <img src={home.image1} alt="Large Image Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            {/* Image 2 */}
                            <div className="space-y-2">
                                <label className={LABEL}>Small Image (Secondary Overlay)</label>
                                <div className="flex gap-3">
                                    <input className={INPUT + " flex-1"} value={home.image2} onChange={e => setHome({ ...home, image2: e.target.value })} placeholder="/hero/2.jpg" />
                                    <label className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-sm flex items-center justify-center shrink-0 min-w-[120px]">
                                        {uploadingHomeImg2 ? "Uploading..." : "Upload Image"}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            disabled={uploadingHomeImg2}
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    await handleImageUpload(file, (url) => setHome(prev => ({ ...prev, image2: url })), setUploadingHomeImg2);
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                                {home.image2 && (
                                    <div className="mt-3 relative w-48 h-32 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                                        <img src={home.image2} alt="Small Image Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid Editor */}
                    <div className={CARD}>
                        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Homepage Stat Cards</h2>
                                <p className="text-xs text-slate-400">{(home.stats || []).length} stats configured</p>
                            </div>
                            <button onClick={openAddHomeStat} className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold">+ Add Stat Card</button>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {(home.stats || []).map((s, i) => (
                                <div key={i} className="rounded-2xl border border-slate-200 p-5 text-center bg-white shadow-sm space-y-1">
                                    <p className="text-xl">{ICON_OPTIONS.find(o => o.value === s.icon)?.label.split(" ")[0] || "📷"}</p>
                                    <p className="text-2xl font-serif font-semibold text-slate-900">{s.value}</p>
                                    <p className="text-xs uppercase tracking-widest text-slate-400">{s.label}</p>
                                    <div className="flex gap-2 pt-2">
                                        <button onClick={() => openEditHomeStat(i)} className="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700">Edit</button>
                                        <button onClick={() => deleteHomeStat(i)} className="py-1.5 px-2.5 rounded-xl text-red-500 hover:bg-red-50 text-xs">Del</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {(!home.stats || home.stats.length === 0) && <p className="text-center text-slate-400 text-sm py-8">No stat cards added.</p>}
                    </div>

                    <div className="flex justify-end">
                        <button onClick={saveHome} disabled={isPending} className={SAVE_BTN}>{isPending ? "Saving…" : "Save Homepage About"}</button>
                    </div>
                </div>
            )}

            {/* ══ TAB: PAGE HERO ══ */}
            {activeTab === "hero" && (
                <div className={CARD + " space-y-5"}>
                    <div className="pb-4 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-900">Page Hero Section</h2>
                        <p className="text-xs text-slate-400">The banner at the top of /about</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className={LABEL}>Eyebrow</label><input className={INPUT} value={hero.eyebrow} onChange={e => setHero({ ...hero, eyebrow: e.target.value })} /></div>
                        <div><label className={LABEL}>Heading</label><input className={INPUT} value={hero.heading} onChange={e => setHero({ ...hero, heading: e.target.value })} /></div>
                    </div>
                    <div><label className={LABEL}>Subtext</label><input className={INPUT} value={hero.subtext} onChange={e => setHero({ ...hero, subtext: e.target.value })} /></div>
                    <div>
                        <label className={LABEL}>Background Image Path</label>
                        <div className="flex gap-3">
                            <input className={INPUT + " flex-1"} value={hero.bgImage} onChange={e => setHero({ ...hero, bgImage: e.target.value })} placeholder="/hero/3.jpg" />
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
                        <button onClick={saveHero} disabled={isPending} className={SAVE_BTN}>{isPending ? "Saving…" : "Save Page Hero"}</button>
                    </div>
                </div>
            )}

            {/* ══ TAB: COMPANY STORY ══ */}
            {activeTab === "story" && (
                <div className="space-y-6">
                    <div className={CARD + " space-y-4"}>
                        <div className="pb-4 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900">Section Header & Image</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className={LABEL}>Eyebrow</label><input className={INPUT} value={story.eyebrow} onChange={e => setStory({ ...story, eyebrow: e.target.value })} /></div>
                            <div>
                                <label className={LABEL}>Heading (use \n for line break)</label>
                                <textarea rows={2} className={INPUT + " resize-none font-mono"} value={story.heading} onChange={e => setStory({ ...story, heading: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label className={LABEL}>Side Image Path</label>
                            <div className="flex gap-3">
                                <input className={INPUT + " flex-1"} value={story.image} onChange={e => setStory({ ...story, image: e.target.value })} placeholder="/hero/2.jpg" />
                                <label className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-sm flex items-center justify-center shrink-0 min-w-[120px]">
                                    {uploadingStory ? "Uploading..." : "Upload Image"}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        disabled={uploadingStory}
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                await handleImageUpload(file, (url) => setStory(prev => ({ ...prev, image: url })), setUploadingStory);
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                            {story.image && (
                                <div className="mt-3 relative w-40 h-24 rounded-xl overflow-hidden border border-slate-200">
                                    <img src={story.image} alt="preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={CARD}>
                        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
                            <div><h2 className="text-lg font-bold text-slate-900">Story Items</h2><p className="text-xs text-slate-400">{story.items.length} items</p></div>
                            <button onClick={openAddStory} className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold">+ Add Item</button>
                        </div>
                        <div className="space-y-3">
                            {story.items.map((item, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-red-500 uppercase tracking-wider">{item.label}</p>
                                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">{item.text}</p>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button onClick={() => openEditStory(i)} className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-semibold text-slate-700">Edit</button>
                                        <button onClick={() => deleteStory(i)} className="px-3 py-1.5 rounded-xl text-red-500 hover:bg-red-50 text-xs font-medium">Del</button>
                                    </div>
                                </div>
                            ))}
                            {story.items.length === 0 && <p className="text-center text-slate-400 text-sm py-6">No story items yet.</p>}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button onClick={saveStory} disabled={isPending} className={SAVE_BTN}>{isPending ? "Saving…" : "Save Company Story"}</button>
                    </div>
                </div>
            )}

            {/* ══ TAB: TEAM ══ */}
            {activeTab === "team" && (
                <div className="space-y-6">
                    <div className={CARD + " space-y-4"}>
                        <div className="pb-4 border-b border-slate-100"><h2 className="text-lg font-bold text-slate-900">Section Header</h2></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className={LABEL}>Eyebrow</label><input className={INPUT} value={team.eyebrow} onChange={e => setTeam({ ...team, eyebrow: e.target.value })} /></div>
                            <div><label className={LABEL}>Heading</label><input className={INPUT} value={team.heading} onChange={e => setTeam({ ...team, heading: e.target.value })} /></div>
                        </div>
                    </div>

                    <div className={CARD}>
                        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
                            <div><h2 className="text-lg font-bold text-slate-900">Team Members</h2><p className="text-xs text-slate-400">{team.members.length} members</p></div>
                            <button onClick={openAddMember} className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold">+ Add Member</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {team.members.map((m, i) => (
                                <div key={i} className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                                    <img src={m.image || "/hero/1.jpg"} alt={m.name} className="w-full h-32 object-cover" />
                                    <div className="p-4">
                                        <p className="font-bold text-slate-900 text-sm">{m.name}</p>
                                        <p className="text-xs text-red-500 uppercase tracking-wide mt-0.5">{m.role}</p>
                                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{m.bio}</p>
                                        <div className="flex gap-2 mt-3">
                                            <button onClick={() => openEditMember(i)} className="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700">Edit</button>
                                            <button onClick={() => deleteMember(i)} className="py-1.5 px-2.5 rounded-xl text-red-500 hover:bg-red-50 text-xs">Del</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {team.members.length === 0 && <p className="text-center text-slate-400 text-sm py-8">No team members yet.</p>}
                    </div>

                    <div className="flex justify-end">
                        <button onClick={saveTeam} disabled={isPending} className={SAVE_BTN}>{isPending ? "Saving…" : "Save Team Section"}</button>
                    </div>
                </div>
            )}

            {/* ══ TAB: STATS ══ */}
            {activeTab === "stats" && (
                <div className="space-y-6">
                    <div className={CARD + " space-y-4"}>
                        <div className="pb-4 border-b border-slate-100"><h2 className="text-lg font-bold text-slate-900">Section Header</h2></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className={LABEL}>Eyebrow</label><input className={INPUT} value={stats.eyebrow} onChange={e => setStats({ ...stats, eyebrow: e.target.value })} /></div>
                            <div><label className={LABEL}>Heading</label><input className={INPUT} value={stats.heading} onChange={e => setStats({ ...stats, heading: e.target.value })} /></div>
                        </div>
                    </div>

                    <div className={CARD}>
                        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
                            <div><h2 className="text-lg font-bold text-slate-900">Stat Cards</h2><p className="text-xs text-slate-400">{stats.stats.length} stats</p></div>
                            <button onClick={openAddStat} className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold">+ Add Stat</button>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {stats.stats.map((s, i) => (
                                <div key={i} className="rounded-2xl border border-slate-200 p-5 text-center bg-white shadow-sm">
                                    <p className="text-3xl font-light text-slate-900">{s.value}<span className="text-red-500">{s.suffix}</span></p>
                                    <p className="text-xs uppercase tracking-widest text-slate-400 mt-1">{s.label}</p>
                                    <div className="flex gap-2 mt-3">
                                        <button onClick={() => openEditStat(i)} className="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700">Edit</button>
                                        <button onClick={() => deleteStat(i)} className="py-1.5 px-2.5 rounded-xl text-red-500 hover:bg-red-50 text-xs">Del</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {stats.stats.length === 0 && <p className="text-center text-slate-400 text-sm py-8">No stats yet.</p>}
                    </div>

                    <div className="flex justify-end">
                        <button onClick={saveStats} disabled={isPending} className={SAVE_BTN}>{isPending ? "Saving…" : "Save Stats Section"}</button>
                    </div>
                </div>
            )}

            {/* ══ TAB: WHY CHOOSE US ══ */}
            {activeTab === "why" && (
                <div className="space-y-6">
                    <div className={CARD + " space-y-4"}>
                        <div className="pb-4 border-b border-slate-100"><h2 className="text-lg font-bold text-slate-900">Section Header</h2></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className={LABEL}>Eyebrow</label><input className={INPUT} value={why.eyebrow} onChange={e => setWhy({ ...why, eyebrow: e.target.value })} /></div>
                            <div><label className={LABEL}>Heading</label><input className={INPUT} value={why.heading} onChange={e => setWhy({ ...why, heading: e.target.value })} /></div>
                        </div>
                    </div>

                    <div className={CARD}>
                        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
                            <div><h2 className="text-lg font-bold text-slate-900">Reason Cards</h2><p className="text-xs text-slate-400">{why.items.length} items</p></div>
                            <button onClick={openAddWhy} className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold">+ Add Reason</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {why.items.map((item, i) => (
                                <div key={i} className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm space-y-2">
                                    <p className="text-xl">{ICON_OPTIONS.find(o => o.value === item.icon)?.label.split(" ")[0] || "⭐"}</p>
                                    <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                                    <p className="text-xs text-slate-400 line-clamp-2">{item.desc}</p>
                                    <div className="flex gap-2 pt-2">
                                        <button onClick={() => openEditWhy(i)} className="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700">Edit</button>
                                        <button onClick={() => deleteWhy(i)} className="py-1.5 px-2.5 rounded-xl text-red-500 hover:bg-red-50 text-xs">Del</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {why.items.length === 0 && <p className="text-center text-slate-400 text-sm py-8">No reasons yet.</p>}
                    </div>

                    <div className="flex justify-end">
                        <button onClick={saveWhy} disabled={isPending} className={SAVE_BTN}>{isPending ? "Saving…" : "Save Why Choose Us"}</button>
                    </div>
                </div>
            )}

            {/* ══ MODAL: Story Item ══ */}
            {storyModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h2 className="font-bold text-slate-900">{storyModal.idx !== null ? "Edit" : "Add"} Story Item</h2>
                            <button onClick={() => setStoryModal({ open: false, idx: null })} className="text-slate-400 hover:text-slate-900 text-lg p-1">✕</button>
                        </div>
                        <div><label className={LABEL}>Label (e.g. Our Beginning)</label><input className={INPUT} value={storyForm.label} onChange={e => setStoryForm({ ...storyForm, label: e.target.value })} /></div>
                        <div><label className={LABEL}>Text</label><textarea rows={4} className={INPUT + " resize-none"} value={storyForm.text} onChange={e => setStoryForm({ ...storyForm, text: e.target.value })} /></div>
                        <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                            <button onClick={() => setStoryModal({ open: false, idx: null })} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">Cancel</button>
                            <button onClick={saveStoryModal} className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold">{storyModal.idx !== null ? "Update" : "Add"}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══ MODAL: Team Member ══ */}
            {memberModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h2 className="font-bold text-slate-900">{memberModal.idx !== null ? "Edit" : "Add"} Team Member</h2>
                            <button onClick={() => setMemberModal({ open: false, idx: null })} className="text-slate-400 hover:text-slate-900 text-lg p-1">✕</button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className={LABEL}>Name</label><input className={INPUT} value={memberForm.name} onChange={e => setMemberForm({ ...memberForm, name: e.target.value })} /></div>
                            <div><label className={LABEL}>Role</label><input className={INPUT} value={memberForm.role} onChange={e => setMemberForm({ ...memberForm, role: e.target.value })} /></div>
                        </div>
                        <div>
                            <label className={LABEL}>Image Path</label>
                            <div className="flex gap-3">
                                <input className={INPUT + " flex-1"} value={memberForm.image} onChange={e => setMemberForm({ ...memberForm, image: e.target.value })} placeholder="/hero/1.jpg" />
                                <label className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-sm flex items-center justify-center shrink-0 min-w-[120px]">
                                    {uploadingMember ? "Uploading..." : "Upload Image"}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        disabled={uploadingMember}
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                await handleImageUpload(file, (url) => setMemberForm(prev => ({ ...prev, image: url })), setUploadingMember);
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                            {memberForm.image && (
                                <div className="mt-3 relative w-32 h-24 rounded-xl overflow-hidden border border-slate-200">
                                    <img src={memberForm.image} alt="preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                        <div><label className={LABEL}>Short Bio</label><input className={INPUT} value={memberForm.bio} onChange={e => setMemberForm({ ...memberForm, bio: e.target.value })} /></div>
                        <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                            <button onClick={() => setMemberModal({ open: false, idx: null })} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">Cancel</button>
                            <button onClick={saveMemberModal} className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold">{memberModal.idx !== null ? "Update" : "Add"}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══ MODAL: Stat ══ */}
            {statModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h2 className="font-bold text-slate-900">{statModal.idx !== null ? "Edit" : "Add"} Stat</h2>
                            <button onClick={() => setStatModal({ open: false, idx: null })} className="text-slate-400 hover:text-slate-900 text-lg p-1">✕</button>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className={LABEL}>Number</label>
                                <input type="number" className={INPUT} value={statForm.value} onChange={e => setStatForm({ ...statForm, value: parseInt(e.target.value) || 0 })} />
                            </div>
                            <div><label className={LABEL}>Suffix</label><input className={INPUT} value={statForm.suffix} onChange={e => setStatForm({ ...statForm, suffix: e.target.value })} placeholder="+" /></div>
                            <div className="col-span-1">
                                <label className={LABEL}>Label</label>
                                <input className={INPUT} value={statForm.label} onChange={e => setStatForm({ ...statForm, label: e.target.value })} placeholder="Years of Experience" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                            <button onClick={() => setStatModal({ open: false, idx: null })} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">Cancel</button>
                            <button onClick={saveStatModal} className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold">{statModal.idx !== null ? "Update" : "Add"}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══ MODAL: Homepage Stat ══ */}
            {homeStatModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h2 className="font-bold text-slate-900">{homeStatModal.idx !== null ? "Edit" : "Add"} Homepage Stat Card</h2>
                            <button onClick={() => setHomeStatModal({ open: false, idx: null })} className="text-slate-400 hover:text-slate-900 text-lg p-1">✕</button>
                        </div>
                        <div>
                            <label className={LABEL}>Icon</label>
                            <select className={INPUT} value={homeStatForm.icon} onChange={e => setHomeStatForm({ ...homeStatForm, icon: e.target.value })}>
                                {ICON_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </div>
                        <div><label className={LABEL}>Value (e.g. 500+, 8+, 4.9)</label><input className={INPUT} value={homeStatForm.value} onChange={e => setHomeStatForm({ ...homeStatForm, value: e.target.value })} /></div>
                        <div><label className={LABEL}>Label (e.g. Stories Told)</label><input className={INPUT} value={homeStatForm.label} onChange={e => setHomeStatForm({ ...homeStatForm, label: e.target.value })} /></div>
                        <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                            <button onClick={() => setHomeStatModal({ open: false, idx: null })} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">Cancel</button>
                            <button onClick={saveHomeStatModal} className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold">{homeStatModal.idx !== null ? "Update" : "Add"}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══ MODAL: Why Item ══ */}
            {whyModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h2 className="font-bold text-slate-900">{whyModal.idx !== null ? "Edit" : "Add"} Reason</h2>
                            <button onClick={() => setWhyModal({ open: false, idx: null })} className="text-slate-400 hover:text-slate-900 text-lg p-1">✕</button>
                        </div>
                        <div>
                            <label className={LABEL}>Icon</label>
                            <select className={INPUT} value={whyForm.icon} onChange={e => setWhyForm({ ...whyForm, icon: e.target.value })}>
                                {ICON_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </div>
                        <div><label className={LABEL}>Title</label><input className={INPUT} value={whyForm.title} onChange={e => setWhyForm({ ...whyForm, title: e.target.value })} /></div>
                        <div><label className={LABEL}>Description</label><textarea rows={3} className={INPUT + " resize-none"} value={whyForm.desc} onChange={e => setWhyForm({ ...whyForm, desc: e.target.value })} /></div>
                        <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                            <button onClick={() => setWhyModal({ open: false, idx: null })} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">Cancel</button>
                            <button onClick={saveWhyModal} className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold">{whyModal.idx !== null ? "Update" : "Add"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
