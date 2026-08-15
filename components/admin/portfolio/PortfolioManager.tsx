"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  createPortfolioAlbum,
  deletePortfolioAlbum,
  getPortfolioAlbums,
  uploadToCloudinary,
} from "@/actions/portfolioActions";
import {
  createCategory,
  deleteCategory,
  getCategoriesAction,
} from "@/actions/categoryActions";
import { CategoryData } from "@/lib/types/portfolio";

export interface PortfolioAlbumUI {
  id: string;
  slug: string;
  title: string;
  category: string;
  clientName: string;
  eventDate: string;
  location: string;
  coverImage: string;
  photoCount: number;
  description: string;
  featured: boolean;
  images?: { src: string; alt: string }[];
}

interface PortfolioManagerProps {
  initialAlbums?: PortfolioAlbumUI[];
  initialCategories?: string[];
}

export default function PortfolioManager({
  initialAlbums = [],
  initialCategories = ["All"],
}: PortfolioManagerProps) {
  const [albums, setAlbums] = useState<PortfolioAlbumUI[]>(initialAlbums);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [dbCategories, setDbCategories] = useState<CategoryData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<PortfolioAlbumUI | null>(
    null
  );

  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [categoryStatusMsg, setCategoryStatusMsg] = useState<string | null>(
    null
  );

  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Wedding",
    clientName: "",
    eventDate: "",
    location: "Dhaka, Bangladesh",
    coverImage: "",
    description: "",
    featured: false,
    images: [] as { src: string; alt: string }[],
  });

  // Fetch albums and categories via server actions on mount — only if no initial data from server
  useEffect(() => {
    if (initialAlbums.length > 0 && initialCategories.length > 1) return;

    async function loadData() {
      // Load Albums via Server Action
      const albumRes = await getPortfolioAlbums();
      if (albumRes.success && albumRes.albums) {
        setAlbums(albumRes.albums);
      }

      // Load Categories via Server Action
      const dbCatRes = await getCategoriesAction();
      if (dbCatRes.success && dbCatRes.categories) {
        setDbCategories(dbCatRes.categories);
        setCategories(["All", ...dbCatRes.categories.map((c) => c.name)]);
      }
    }
    loadData();
  }, []);

  const refreshCategories = async () => {
    const dbCatRes = await getCategoriesAction();
    if (dbCatRes.success && dbCatRes.categories) {
      setDbCategories(dbCatRes.categories);
      setCategories(["All", ...dbCatRes.categories.map((c) => c.name)]);
    }
  };

  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryInput.trim()) return;

    setCategoryStatusMsg("Adding category...");
    const res = await createCategory(newCategoryInput.trim());

    if (res.success) {
      setNewCategoryInput("");
      setCategoryStatusMsg("Category added successfully!");
      await refreshCategories();
    } else {
      setCategoryStatusMsg(res.error || "Failed to add category.");
    }
  };

  const handleDeleteCategoryClick = async (id: string, catName: string) => {
    if (confirm(`Are you sure you want to delete category "${catName}"?`)) {
      const res = await deleteCategory(id);
      if (res.success) {
        await refreshCategories();
      } else {
        alert(res.error || "Failed to delete category.");
      }
    }
  };

  const filteredAlbums = albums.filter((album) => {
    const matchesCategory =
      selectedCategory === "All" || album.category === selectedCategory;
    const matchesSearch =
      album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingAlbum(null);
    setFormData({
      title: "",
      category: categories[1] || "Wedding",
      clientName: "",
      eventDate: new Date().toISOString().split("T")[0],
      location: "Dhaka, Bangladesh",
      coverImage: "",
      description: "",
      featured: false,
      images: [],
    });
    setStatusMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (album: PortfolioAlbumUI) => {
    setEditingAlbum(album);
    setFormData({
      title: album.title,
      category: album.category,
      clientName: album.clientName,
      eventDate: album.eventDate,
      location: album.location || "Dhaka, Bangladesh",
      coverImage: album.coverImage,
      description: album.description,
      featured: album.featured,
      images: album.images || [],
    });
    setStatusMessage(null);
    setIsModalOpen(true);
  };

  // Upload Single Cover Image to Cloudinary directly
  const handleCoverImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingCover(true);
    setStatusMessage("Uploading cover photo to Cloudinary...");

    const fd = new FormData();
    fd.append("file", files[0]);

    const res = await uploadToCloudinary(fd);

    setIsUploadingCover(false);

    if (res.success && res.urls && res.urls.length > 0) {
      setFormData((prev) => ({ ...prev, coverImage: res.urls![0] }));
      setStatusMessage("Cover photo uploaded successfully!");
    } else {
      setStatusMessage(res.error || "Failed to upload cover photo.");
    }
  };

  // Upload Multiple Gallery Images in Batches of 5 (Supports 30-40+ photos / 60MB+ total size)
  const handleMultipleGalleryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const totalFiles = fileList.length;
    const BATCH_SIZE = 5;

    setIsUploadingGallery(true);
    setStatusMessage(`Preparing to upload ${totalFiles} images...`);

    const allUploadedUrls: string[] = [];

    for (let i = 0; i < totalFiles; i += BATCH_SIZE) {
      const batch = fileList.slice(i, i + BATCH_SIZE);
      const currentBatchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(totalFiles / BATCH_SIZE);

      setStatusMessage(
        `Uploading batch ${currentBatchNum} of ${totalBatches} (${batch.length} photos)...`
      );

      const fd = new FormData();
      batch.forEach((file) => fd.append("files", file));

      const res = await uploadToCloudinary(fd);

      if (res.success && res.urls && res.urls.length > 0) {
        allUploadedUrls.push(...res.urls);
      } else {
        console.error(`Batch ${currentBatchNum} upload error:`, res.error);
      }
    }

    setIsUploadingGallery(false);

    if (allUploadedUrls.length > 0) {
      const newImages = allUploadedUrls.map((url, idx) => ({
        src: url,
        alt: `${formData.title || "Portfolio photo"} ${idx + 1}`,
      }));

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
        coverImage: prev.coverImage || allUploadedUrls[0], // Auto-assign 1st photo as cover if not set
      }));

      setStatusMessage(
        `Successfully uploaded ${allUploadedUrls.length} of ${totalFiles} gallery photos!`
      );
    } else {
      setStatusMessage("Failed to upload gallery images. Please try again.");
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this album?")) {
      if (id.length > 10) {
        await deletePortfolioAlbum(id);
      }
      setAlbums((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.coverImage) {
      alert("Please upload or enter a cover image URL.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("Saving portfolio album...");

    const res = await createPortfolioAlbum({
      ...formData,
      category: formData.category as any,
    });

    setIsSubmitting(false);

    if (res.success && res.album) {
      const createdAlbum: PortfolioAlbumUI = {
        id: res.album._id?.toString() || Date.now().toString(),
        slug: res.album.slug,
        title: res.album.title,
        category: res.album.category,
        clientName: res.album.clientName,
        eventDate: res.album.eventDate,
        location: res.album.location,
        coverImage: res.album.coverImage,
        photoCount: res.album.images?.length || 0,
        description: res.album.description,
        featured: res.album.featured,
        images: res.album.images,
      };

      setAlbums([
        createdAlbum,
        ...albums.filter((a) => a.id !== createdAlbum.id),
      ]);
      setIsModalOpen(false);
    } else {
      const newAlbum: PortfolioAlbumUI = {
        id: Date.now().toString(),
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        photoCount: formData.images.length || 1,
        ...formData,
      };
      setAlbums([newAlbum, ...albums]);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Portfolio Albums
          </h1>
          <p className="text-sm text-slate-500">
            Add, edit, or manage photography albums and dynamic categories
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setCategoryStatusMsg(null);
              setIsCategoryModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all duration-200 shadow-sm"
          >
            📁 Manage Categories
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-all duration-200 shadow-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add New Album
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search title, client, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
      </div>

      {/* Album Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlbums.map((album) => (
          <div
            key={album.id}
            className="group relative rounded-2xl bg-white border border-slate-200/80 overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300 shadow-sm"
          >
            {/* Image Thumbnail */}
            <div className="relative h-52 w-full overflow-hidden bg-slate-100">
              {album.coverImage ? (
                <Image
                  src={album.coverImage}
                  alt={album.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 text-xs">
                  No Cover Image
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-900 text-xs font-semibold shadow-sm">
                  {album.category}
                </span>
                {album.featured && (
                  <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-sm">
                    Featured
                  </span>
                )}
              </div>

              <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/90 text-white text-xs font-mono">
                {album.photoCount || album.images?.length || 0} Photos
              </span>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-amber-600 transition-colors">
                  {album.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {album.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-1 text-xs text-slate-500">
                <div className="flex items-center justify-between">
                  <span>
                    Client:{" "}
                    <strong className="text-slate-800">
                      {album.clientName || "N/A"}
                    </strong>
                  </span>
                  <span className="font-mono">{album.eventDate}</span>
                </div>
                <div className="text-slate-500 font-medium">
                  📍 <span>{album.location}</span>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleOpenEdit(album)}
                className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <svg
                  className="w-3.5 h-3.5 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
                Edit Album
              </button>

              <button
                onClick={() => handleDelete(album.id)}
                className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Category Management Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                📁 Category Manager
              </h2>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            {categoryStatusMsg && (
              <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                {categoryStatusMsg}
              </div>
            )}

            {/* Add Category Form */}
            <form
              onSubmit={handleAddCategorySubmit}
              className="mt-4 flex gap-2"
            >
              <input
                type="text"
                required
                placeholder="New category name (e.g. Birthday, Corporate)..."
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-sm shrink-0"
              >
                Add Category
              </button>
            </form>

            {/* Existing Categories List */}
            <div className="mt-6">
              <h3 className="text-xs font-semibold text-slate-700 mb-2">
                Available Categories ({categories.length - 1})
              </h3>
              <div className="max-h-60 overflow-y-auto space-y-2 p-1">
                {categories
                  .filter((c) => c !== "All")
                  .map((catName) => {
                    const dbCat = dbCategories.find((d) => d.name === catName);
                    return (
                      <div
                        key={catName}
                        className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800"
                      >
                        <span className="font-semibold">{catName}</span>
                        {dbCat ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteCategoryClick(dbCat.id, dbCat.name)
                            }
                            className="text-red-500 hover:text-red-700 font-medium text-[11px] px-2 py-1 rounded hover:bg-red-50"
                          >
                            Delete
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full font-mono">
                            Default
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Album Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative my-8 text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                {editingAlbum ? "Edit Album" : "Add New Album"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            {statusMessage && (
              <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                {statusMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 mt-6">
              {/* Album Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Album Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahim & Sarah's Destination Royal Wedding"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              {/* Category & Client Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCategoryModalOpen(true);
                      }}
                      className="text-[11px] text-amber-600 hover:underline font-semibold"
                    >
                      + Add New Category
                    </button>
                  </div>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  >
                    {categories
                      .filter((c) => c !== "All")
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahim & Sarah"
                    value={formData.clientName}
                    onChange={(e) =>
                      setFormData({ ...formData, clientName: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              </div>

              {/* Event Date & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) =>
                      setFormData({ ...formData, eventDate: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sundarban, Dhaka"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              </div>

              {/* Cover Image Upload (Direct Upload or Select from Gallery) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cover Photo *
                </label>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                  {formData.coverImage ? (
                    <div className="relative w-28 h-20 rounded-xl overflow-hidden border border-slate-300 shrink-0 shadow-sm">
                      <img
                        src={formData.coverImage}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 bg-amber-400 text-slate-950 font-bold text-[9px] px-1.5 py-0.5 rounded shadow">
                        Cover
                      </span>
                    </div>
                  ) : (
                    <div className="w-28 h-20 rounded-xl bg-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs shrink-0 font-medium">
                      No Cover
                    </div>
                  )}

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div className="flex flex-wrap gap-2">
                      <label className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs cursor-pointer inline-flex items-center gap-1.5 shadow-sm">
                        📷{" "}
                        {isUploadingCover
                          ? "Uploading Cover..."
                          : "Upload Cover Photo"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleCoverImageUpload}
                          disabled={isUploadingCover}
                        />
                      </label>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Select a photo file from your computer. If you upload
                      gallery photos below, the 1st photo will automatically
                      become the cover!
                    </p>
                  </div>
                </div>
              </div>

              {/* Multiple Gallery Images Upload (Cloudinary) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Gallery Photos (Multiple Cloudinary Upload)
                  </label>
                  <span className="text-xs text-slate-500 font-mono">
                    {formData.images.length} uploaded
                  </span>
                </div>

                <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-center space-y-3">
                  <svg
                    className="w-8 h-8 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>

                  <label className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer shadow-sm">
                    {isUploadingGallery
                      ? "Uploading Images to Cloudinary..."
                      : "Select & Upload Multiple Photos"}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleMultipleGalleryUpload}
                      disabled={isUploadingGallery}
                    />
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Upload multiple photos for this album folder. Images will
                    upload directly to Cloudinary.
                  </p>
                </div>

                {/* Uploaded Image Thumbnails Grid */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 mt-3 max-h-40 overflow-y-auto p-2 bg-slate-100 rounded-xl">
                    {formData.images.map((img, i) => (
                      <div
                        key={i}
                        className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 bg-white"
                      >
                        <img
                          src={img.src}
                          alt={img.alt || `Photo ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(i)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Album Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the story, mood, and details of this shoot..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              

              {/* Form Buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isSubmitting || isUploadingCover || isUploadingGallery
                  }
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold shadow-sm disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Creating Album..."
                    : editingAlbum
                    ? "Save Changes"
                    : "Create Portfolio Album"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
