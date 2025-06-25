import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/utils/dbconnect";
import Product from "@/models/product";

// Helper: CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Change to your domain in production!
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
 

  try {
    // Validate slug param
    const slug = params?.slug;
    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid slug parameter" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Connect to database
    await dbConnect();

    // Find product by slug (case-insensitive)
    const product = await Product.findOne({ slug: slug.toLowerCase() });
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Success
    return NextResponse.json(
      { success: true, product },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error?.message || "Unknown error",
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
