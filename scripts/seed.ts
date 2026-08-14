

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load .env from project root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });


const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true, select: false },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        loginAttempts: { type: Number, default: 0 },
        lockUntil: { type: Number, default: null },
    },
    { timestamps: true, versionKey: false }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);


const ADMIN = {
    name: "The Story Admin",
    email: "admin@thestory.com",   // ← Change this
    password: "Admin@12345",       // ← Change this (min 6 chars)
    role: "admin" as const,
};

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error("❌  MONGO_URI not found in .env");
        process.exit(1);
    }

    console.log("🔌  Connecting to MongoDB…");
    await mongoose.connect(uri, { dbName: "photography" });
    console.log("✅  Connected.");

    // Check if admin already exists
    const existing = await User.findOne({ email: ADMIN.email });
    if (existing) {
        console.log(`ℹ️   Admin user already exists: ${ADMIN.email}`);
        console.log("    Run this script again after changing the email to create a new admin.");
        await mongoose.disconnect();
        return;
    }

    // Hash the password (cost 12 — same as the app)
    const hashedPassword = await bcrypt.hash(ADMIN.password, 12);

    await User.create({
        name: ADMIN.name,
        email: ADMIN.email,
        password: hashedPassword,
        role: ADMIN.role,
    });

    console.log("🎉  Admin user created successfully!");
    console.log(`    Email:    ${ADMIN.email}`);
    console.log(`    Password: ${ADMIN.password}`);
    console.log("    Role:     admin");
    console.log("\n⚠️  Please change the email & password in the seed script after first run.");

    await mongoose.disconnect();
    console.log("👋  Disconnected.");
}

seed().catch((err) => {
    console.error("❌  Seed failed:", err);
    process.exit(1);
});
