import { dbConnect } from "@/utils/dbconnect";
import { Category } from "@/models/Category";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const categories = await Category.find({});
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
