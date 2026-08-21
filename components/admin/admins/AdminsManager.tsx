"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminUser } from "@/lib/data/adminsData";
import { UserCheck, UserPlus, Mail, Calendar, Shield, User, Trash2, ShieldAlert, Loader2 } from "lucide-react";
import { updateUserRole, deleteUser } from "@/actions/userActions";

interface AdminsManagerProps {
    admins: AdminUser[];
}

export default function AdminsManager({ admins }: AdminsManagerProps) {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [userList, setUserList] = useState<AdminUser[]>(admins);

    useEffect(() => {
        setUserList(admins);
    }, [admins]);

    const handleRoleToggle = async (userId: string, currentRole: "user" | "admin") => {
        const nextRole = currentRole === "admin" ? "user" : "admin";
        setLoadingId(userId);
        try {
            const res = await updateUserRole(userId, nextRole);
            if (res.success) {
                setUserList((prev) =>
                    prev.map((u) => (u.id === userId ? { ...u, role: nextRole } : u))
                );
            } else {
                alert(res.message);
            }
        } catch (err: any) {
            alert(err.message || "Failed to update role");
        } finally {
            setLoadingId(null);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            return;
        }
        setDeletingId(userId);
        try {
            const res = await deleteUser(userId);
            if (res.success) {
                setUserList((prev) => prev.filter((u) => u.id !== userId));
            } else {
                alert(res.message);
            }
        } catch (err: any) {
            alert(err.message || "Failed to delete user");
        } finally {
            setDeletingId(null);
        }
    };

    const adminCount = userList.filter((u) => u.role === "admin").length;
    const totalCount = userList.length;

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-5 h-5 text-amber-500" />
                        <p className="text-xs font-bold uppercase tracking-widest text-amber-500">
                            System
                        </p>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        User & Admin Management
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        View and manage all registered users and administrators.
                    </p>
                </div>

                <Link
                    href="/register"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-lg shadow transition-all duration-200 hover:shadow-md"
                >
                    <UserPlus className="w-4 h-4" />
                    Register New User
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="flex flex-wrap gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4 min-w-[200px]">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                        <UserCheck className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                        <p className="text-3xl font-extrabold text-slate-900 leading-none">
                            {adminCount}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                            Total Admins
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4 min-w-[200px]">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                        <User className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                        <p className="text-3xl font-extrabold text-slate-900 leading-none">
                            {totalCount}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                            Total Registered Users
                        </p>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {userList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                        <Shield className="w-10 h-10" />
                        <p className="font-semibold text-sm">No users found</p>
                        <Link
                            href="/register"
                            className="text-amber-500 hover:text-amber-600 text-xs underline underline-offset-2"
                        >
                            Register the first user →
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                                        #
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                                        Name
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                                        Email
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                                        Joined
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                                        Role
                                    </th>
                                    <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {userList.map((userItem, idx) => {
                                    const isAdmin = userItem.role === "admin";
                                    const isLoadingRole = loadingId === userItem.id;
                                    const isDeleting = deletingId === userItem.id;

                                    return (
                                        <tr
                                            key={userItem.id}
                                            className="hover:bg-slate-50/70 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                                                {idx + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ${isAdmin
                                                        ? "bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950"
                                                        : "bg-slate-200 text-slate-700"
                                                        }`}>
                                                        {userItem.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-semibold text-slate-800">
                                                        {userItem.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                    <span>{userItem.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                    <span>{userItem.createdAt}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {isAdmin ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                                        <Shield className="w-3 h-3" />
                                                        Admin
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                                        <User className="w-3 h-3" />
                                                        User
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => handleRoleToggle(userItem.id, userItem.role)}
                                                    disabled={isLoadingRole || isDeleting}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${isAdmin
                                                        ? "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300"
                                                        : "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300"
                                                        } disabled:opacity-50`}
                                                    title={isAdmin ? "Demote to User" : "Make Admin"}
                                                >
                                                    {isLoadingRole ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    ) : isAdmin ? (
                                                        <>
                                                            <User className="w-3.5 h-3.5" />
                                                            Demote to User
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                                                            Make Admin
                                                        </>
                                                    )}
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteUser(userItem.id)}
                                                    disabled={isLoadingRole || isDeleting}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all disabled:opacity-50"
                                                    title="Delete User"
                                                >
                                                    {isDeleting ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
