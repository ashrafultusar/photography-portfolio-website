import mongoose from "mongoose";

// Global cache type definition
type MongooseCache = {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
};

// Declare global variable for caching
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

// Initialize cache
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  // If connection is already open and ready, return immediately
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      dbName: "photography",
      bufferCommands: false,
      maxPoolSize: 10,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 3000,
    };

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not defined");
    }

    cached.promise = mongoose
      .connect(process.env.MONGO_URI, opts)
      .then((mongooseInstance) => {
        console.log("MongoDB connected successfully!");
        return mongooseInstance.connection;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};