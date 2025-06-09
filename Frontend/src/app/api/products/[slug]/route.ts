// import { NextResponse } from "next/server";
// import { dbConnect } from "@/utils/dbconnect";
// import Product from "@/models/product";

// export async function GET(
//   req: Request,
//   context: { params: { slug: string } }
// ) {
//   try {
//     await dbConnect();
//     // console.log("params:(before await) ", context.params);

//     // const params = await context.params;
//     const  {slug } = context.params;
//     if (!slug) {
//       return NextResponse.json({ success: false, error: "Slug is missing" }, { status: 400 });
//     }
//     const product = await Product.findOne({ slug });

//     if (!product) {
//       return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, product });
//   } catch (error) {
//     return NextResponse.json({
//       success: false,
//       error: error instanceof Error ? error.message : "An unknown error occurred",
//     }, { status: 500 });
//   }
// }


// app/api/products/[slug]/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/utils/dbconnect";
import Product from "@/models/product";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    
    // Await the params - this is the key change
    const params = await context.params;
    const { slug } = params;
    
    console.log("API: Received slug:", slug); // Add this for debugging
    
    if (!slug) {
      console.log("API: Slug is missing");
      return NextResponse.json({ success: false, error: "Slug is missing" }, { status: 400 });
    }

    const product = await Product.findOne({ slug });
    console.log("API: Database query result:", product ? "Found" : "Not found"); // Add this for debugging

    if (!product) {
      console.log("API: Product not found for slug:", slug);
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("API: Error occurred:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }, { status: 500 });
  }
}