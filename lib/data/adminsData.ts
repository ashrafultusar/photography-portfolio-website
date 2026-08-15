import { connectDB } from "@/db/dbConfig";
import User from "@/models/User";

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    createdAt: string;
}

/**
 * Fetch all registered users from MongoDB.
 * Not cached — always returns real-time data for user/admin management.
 */
export async function getAllAdmins(): Promise<AdminUser[]> {
    try {
        await connectDB();
        const users = await User.find()
            .select("name email role createdAt")
            .sort({ createdAt: -1 })
            .lean();

        return users.map((u: any) => ({
            id: u._id.toString(),
            name: u.name,
            email: u.email,
            role: u.role || "user",
            createdAt: u.createdAt
                ? new Date(u.createdAt).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                })
                : "N/A",
        }));
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}
