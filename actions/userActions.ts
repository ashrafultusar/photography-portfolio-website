"use server";

import { connectDB } from "@/db/dbConfig";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, newRole: "user" | "admin") {
    try {
        await connectDB();
        await User.findByIdAndUpdate(userId, { role: newRole });
        revalidatePath("/my-dashboard/admins");
        return { success: true, message: `User role updated to ${newRole}` };
    } catch (error: any) {
        console.error("Error updating user role:", error);
        return { success: false, message: error.message || "Failed to update role." };
    }
}

export async function deleteUser(userId: string) {
    try {
        await connectDB();
        await User.findByIdAndDelete(userId);
        revalidatePath("/my-dashboard/admins");
        return { success: true, message: "User deleted successfully." };
    } catch (error: any) {
        console.error("Error deleting user:", error);
        return { success: false, message: error.message || "Failed to delete user." };
    }
}
