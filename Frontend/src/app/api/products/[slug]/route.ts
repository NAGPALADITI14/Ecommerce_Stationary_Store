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







import { NextResponse } from "next/server";
import { dbConnect } from "@/utils/dbconnect";
import Product from "@/models/product";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  // Add CORS headers to handle cross-origin requests
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  };

  try {
    console.log("=== API ROUTE START ===");
    console.log("Request URL:", req.url);
    console.log("Request headers:", Object.fromEntries(req.headers.entries()));
    
    await dbConnect();
    console.log("Database connected");
    
    const params = await context.params;
    const { slug } = params;
    
    console.log("Slug received:", slug);
    
    if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid slug parameter",
        debug: { receivedSlug: slug, type: typeof slug }
      }, { 
        status: 400,
        headers: corsHeaders
      });
    }
    
    const decodedSlug = decodeURIComponent(slug.trim());
    console.log("Searching for product with slug:", decodedSlug);
    
    const product = await Product.findOne({ slug: decodedSlug });
    console.log("Product found:", !!product);
    
    if (!product) {
      return NextResponse.json({ 
        success: false, 
        error: "Product not found",
        debug: { searchedSlug: decodedSlug }
      }, { 
        status: 404,
        headers: corsHeaders
      });
    }

    return NextResponse.json({ 
      success: true, 
      product 
    }, {
      headers: corsHeaders
    });
    
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error"
    }, { 
      status: 500,
      headers: corsHeaders
    });
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}