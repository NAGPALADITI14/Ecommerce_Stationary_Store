import { NextResponse } from "next/server";
import { dbConnect } from "@/utils/dbconnect";
import Product from "@/models/product";

export async function GET(
  req: Request,
  context: { params: { slug: string } }
) {
  try {
    await dbConnect();
    // console.log("params:(before await) ", context.params);

    // const params = await context.params;
    const  {slug } = context.params;
    if (!slug) {
      return NextResponse.json({ success: false, error: "Slug is missing" }, { status: 400 });
    }
    const product = await Product.findOne({ slug });

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }, { status: 500 });
  }
}
