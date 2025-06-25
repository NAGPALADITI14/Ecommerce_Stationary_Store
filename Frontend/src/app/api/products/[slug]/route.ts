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


// // app/api/products/[slug]/route.ts
// import { NextResponse } from "next/server";
// import { dbConnect } from "@/utils/dbconnect";
// import Product from "@/models/product";

// export async function GET(
//   req: Request,
//   context: { params: Promise<{ slug: string }> }
// ) {
//   try {
//     await dbConnect();
    
//     // Await the params - this is the key change
//     const params = await context.params;
//     const { slug } = params;
    
//     console.log("API: Received slug:", slug); // Add this for debugging
    
//     if (!slug) {
//       console.log("API: Slug is missing");
//       return NextResponse.json({ success: false, error: "Slug is missing" }, { status: 400 });
//     }

//     const product = await Product.findOne({ slug });
//     console.log("API: Database query result:", product ? "Found" : "Not found"); // Add this for debugging

//     if (!product) {
//       console.log("API: Product not found for slug:", slug);
//       return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, product });
//   } catch (error) {
//     console.error("API: Error occurred:", error);
//     return NextResponse.json({
//       success: false,
//       error: error instanceof Error ? error.message : "An unknown error occurred",
//     }, { status: 500 });
//   }
// }





// import { NextResponse } from "next/server";
// import { dbConnect } from "@/utils/dbconnect";
// import Product from "@/models/product";

// export async function GET(
//   req: Request,
//   context: { params: Promise<{ slug: string }> }
// ) {
//   try {
//     console.log("API: Starting product fetch"); // Add debugging
    
//     await dbConnect();
//     console.log("API: Database connected"); // Add debugging
    
//     // Await the params - this is the key change for Next.js 15+
//     const params = await context.params;
//     const { slug } = params;
    
//     console.log("API: Received slug:", slug); // Debug logging
    
//     if (!slug) {
//       console.log("API: Slug is missing");
//       return NextResponse.json({ 
//         success: false, 
//         error: "Slug is missing" 
//       }, { status: 400 });
//     }

//     // URL decode the slug in case it contains special characters
//     const decodedSlug = decodeURIComponent(slug);
//     console.log("API: Decoded slug:", decodedSlug);

//     const product = await Product.findOne({ slug: decodedSlug });
//     console.log("API: Database query result:", product ? "Found" : "Not found");

//     if (!product) {
//       console.log("API: Product not found for slug:", decodedSlug);
//       return NextResponse.json({ 
//         success: false, 
//         error: "Product not found" 
//       }, { status: 404 });
//     }

//     return NextResponse.json({ 
//       success: true, 
//       product 
//     }, {
//       // Add CORS headers if needed
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Methods': 'GET',
//         'Access-Control-Allow-Headers': 'Content-Type',
//       }
//     });
//   } catch (error) {
//     console.error("API: Error occurred:", error);
//     return NextResponse.json({
//       success: false,
//       error: error instanceof Error ? error.message : "An unknown error occurred",
//     }, { status: 500 });
//   }
// }





// import { NextResponse } from "next/server";
// import { dbConnect } from "@/utils/dbconnect";
// import Product from "@/models/product";

// export async function GET(
//   req: Request,
//   context: { params: Promise<{ slug: string }> }
// ) {
//   const startTime = Date.now();
  
//   try {
//     console.log("=== API ROUTE DEBUG START ===");
//     console.log("Request URL:", req.url);
//     console.log("Request method:", req.method);
//     console.log("Headers:", Object.fromEntries(req.headers.entries()));
    
//     // Connect to database
//     console.log("Connecting to database...");
//     await dbConnect();
//     console.log("Database connected successfully");
    
//     // Get params
//     console.log("Resolving params...");
//     const params = await context.params;
//     console.log("Raw params:", params);
    
//     const { slug } = params;
//     console.log("Extracted slug:", slug);
//     console.log("Slug type:", typeof slug);
//     console.log("Slug length:", slug?.length);
    
//     // Validate slug
//     if (!slug) {
//       console.error("❌ Slug validation failed: slug is falsy");
//       return NextResponse.json({ 
//         success: false, 
//         error: "Slug parameter is required",
//         debug: {
//           receivedSlug: slug,
//           slugType: typeof slug,
//           params: params
//         }
//       }, { status: 400 });
//     }
    
//     if (typeof slug !== 'string') {
//       console.error("❌ Slug validation failed: slug is not a string");
//       return NextResponse.json({ 
//         success: false, 
//         error: "Slug must be a string",
//         debug: {
//           receivedSlug: slug,
//           slugType: typeof slug
//         }
//       }, { status: 400 });
//     }
    
//     if (slug.trim().length === 0) {
//       console.error("❌ Slug validation failed: slug is empty");
//       return NextResponse.json({ 
//         success: false, 
//         error: "Slug cannot be empty",
//         debug: {
//           receivedSlug: slug,
//           slugLength: slug.length
//         }
//       }, { status: 400 });
//     }
    
//     // Process slug
//     const decodedSlug = decodeURIComponent(slug.trim());
//     console.log("Decoded slug:", decodedSlug);
    
//     // Query database
//     console.log("Querying database for slug:", decodedSlug);
//     const product = await Product.findOne({ slug: decodedSlug });
//     console.log("Database query completed");
//     console.log("Product found:", !!product);
    
//     if (product) {
//       console.log("Product ID:", product._id);
//       console.log("Product name:", product.name);
//     }

//     if (!product) {
//       console.log("❌ Product not found for slug:", decodedSlug);
      
//       // Additional debugging: check similar slugs
//       const similarProducts = await Product.find({
//         slug: { $regex: decodedSlug.substring(0, 10), $options: 'i' }
//       }).limit(5).select('slug name');
      
//       console.log("Similar products found:", similarProducts.length);
//       similarProducts.forEach(p => console.log("Similar slug:", p.slug));
      
//       return NextResponse.json({ 
//         success: false, 
//         error: "Product not found",
//         debug: {
//           searchedSlug: decodedSlug,
//           originalSlug: slug,
//           similarSlugs: similarProducts.map(p => p.slug)
//         }
//       }, { status: 404 });
//     }

//     const responseTime = Date.now() - startTime;
//     console.log(`✅ Success! Response time: ${responseTime}ms`);
//     console.log("=== API ROUTE DEBUG END ===");

//     return NextResponse.json({ 
//       success: true, 
//       product,
//       debug: {
//         responseTime: `${responseTime}ms`,
//         slug: decodedSlug
//       }
//     });
    
//   } catch (error) {
//     const responseTime = Date.now() - startTime;
//     console.error("❌ API ERROR:", error);
//     console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
//     console.error("Response time:", `${responseTime}ms`);
//     console.log("=== API ROUTE DEBUG END (ERROR) ===");
    
//     return NextResponse.json({
//       success: false,
//       error: error instanceof Error ? error.message : "An unknown error occurred",
//       debug: {
//         errorType: error instanceof Error ? error.constructor.name : typeof error,
//         responseTime: `${responseTime}ms`
//       }
//     }, { status: 500 });
//   }
// }






// import { NextRequest, NextResponse } from "next/server";
// import { dbConnect } from "@/utils/dbconnect";
// import Product from "@/models/product";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { slug: string } }
// ) {
//   // Add CORS headers
//   const headers = {
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//     'Content-Type': 'application/json',
//   };

//   try {
//     console.log("=== API ROUTE DEBUG START ===");
//     console.log("Request method:", request.method);
//     console.log("Request URL:", request.url);
//     console.log("Raw params:", params);
    
//     const resolvedParams = await Promise.resolve(params);
//     const slug = resolvedParams.slug;
    
//     console.log("Resolved slug:", slug);
//     console.log("Slug type:", typeof slug);
    
//     if (!slug || typeof slug !== 'string') {
//       console.error("❌ Invalid slug");
//       return NextResponse.json(
//         { success: false, error: "Invalid slug parameter" },
//         { status: 400, headers }
//       );
//     }

//     console.log("Connecting to database...");
//     await dbConnect();
//     console.log("✅ Database connected");

//     console.log("Searching for product with slug:", slug);
//     const product = await Product.findOne({ slug: slug.toLowerCase() });
//     console.log("Database query result:", !!product);
    
//     if (!product) {
//       console.log("❌ Product not found");
//       return NextResponse.json(
//         { success: false, error: "Product not found" },
//         { status: 404, headers }
//       );
//     }

//     console.log("✅ Product found, returning data");
//     console.log("=== API ROUTE DEBUG END ===");
    
//     return NextResponse.json(
//       { success: true, product },
//       { status: 200, headers }
//     );
    
//   } catch (error) {
//     console.error("❌ API Route Error:", error);
//     console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error);
    
//     if (error instanceof Error) {
//       console.error("Error message:", error.message);
//       console.error("Error stack:", error.stack);
//     }
    
//     return NextResponse.json(
//       { 
//         success: false, 
//         error: "Internal server error",
//         details: error instanceof Error ? error.message : "Unknown error"
//       },
//       { status: 500, headers }
//     );
//   }
// }

// // Handle preflight requests
// export async function OPTIONS(request: NextRequest) {
//   return new NextResponse(null, {
//     status: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//     },
//   });
// }





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
  // Optional: Simple API key authentication
  // const apiKey = request.headers.get("x-api-key");
  // if (apiKey !== process.env.API_KEY) {
  //   return NextResponse.json(
  //     { success: false, error: "Unauthorized" },
  //     { status: 401, headers: corsHeaders }
  //   );
  // }

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
