import { dbConnect } from "@/utils/dbconnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ message: "Connected to MongoDB!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Database connection failed", error }, { status: 500 });
  }
}
