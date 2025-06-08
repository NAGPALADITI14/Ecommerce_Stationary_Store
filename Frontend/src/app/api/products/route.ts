import { NextResponse } from "next/server";
import  { dbConnect } from "@/utils/dbconnect";
import Product from "@/models/product";

export async function GET() {
  try {
    await dbConnect(); 
    const products = await Product.find(); 
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown error occurred" 
    });
  }
}
