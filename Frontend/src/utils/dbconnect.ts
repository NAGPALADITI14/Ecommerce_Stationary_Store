// /// <reference types="node" />
// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI as string;

// if (!MONGODB_URI) {
//   throw new Error("MONGODB_URI is missing in environment variables");
// }
// console.log("MONGODB_URI:", process.env.MONGODB_URI);
// declare const global: any;
// let cached = global.mongoose || { conn: null, promise: null };

// export async function dbConnect() {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     cached.promise = mongoose
//       .connect(MONGODB_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       } as any)
//       .then((mongoose) => mongoose);
//   }
//   cached.conn = await cached.promise;
//   return cached.conn;
// }




import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing in environment variables");
}

// export const dbConnect = async () => {
//   if (mongoose.connection.readyState >= 1) {
  
//     try {
//       await mongoose.connect(MONGODB_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       } as any);
//       // await mongoose.connect(MONGODB_URI);
//       console.log("Database connected successfully");
//     } catch (error) {
//       console.error("Database connection error:", error);
//       throw new Error("Failed to connect to the database");
//     }
//   }
// };



// export default dbConnect;

export const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log("✅ Already connected to MongoDB.");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("🚀 MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};