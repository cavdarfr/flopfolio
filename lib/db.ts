import mongoose from "mongoose";

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

// Utiliser globalThis pour éviter var et contourner ESLint
const globalCache = globalThis as unknown as { mongooseCache?: MongooseCache };

const cached: MongooseCache = globalCache.mongooseCache || { conn: null, promise: null };

if (!globalCache.mongooseCache) {
    globalCache.mongooseCache = cached;
}

async function dbConnect() {
    const MONGODB_URI = process.env.MONGO_URI!;

    if (!MONGODB_URI) {
        throw new Error(
            "Please define the MONGODB_URI environment variable inside .env.local"
        );
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };
        cached.promise = mongoose.connect(MONGODB_URI, opts);
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;