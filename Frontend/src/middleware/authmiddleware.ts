import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function middleware(req: NextRequest) {
  console.log("=== MIDDLEWARE DEBUG ===");
  console.log("Request path:", req.nextUrl.pathname);
  
  // Special handling for API routes
  if (req.nextUrl.pathname.startsWith('/api/')) {
    // Allow product API to be public (or check for API key instead)
    if (req.nextUrl.pathname.startsWith('/api/products')) {
      console.log("✅ Public API route - allowing access");
      return NextResponse.next();
    }
    
    // For other API routes, check for token but return JSON responses
    const token = req.cookies.get("token")?.value;
    
    if (!token) {
      console.log("❌ API: No token found");
      return new NextResponse(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    try {
      jwt.verify(token, JWT_SECRET);
      console.log("✅ API: Token valid");
      return NextResponse.next();
    } catch (error) {
      console.log("❌ API: Invalid token");
      return new NextResponse(
        JSON.stringify({ success: false, message: "Invalid token" }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
  
  // For non-API routes (pages), redirect to login
  const token = req.cookies.get("token")?.value;
  
  if (!token) {
    console.log("❌ Page: No token - redirecting to login");
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    jwt.verify(token, JWT_SECRET);
    console.log("✅ Page: Token valid");
    return NextResponse.next();
  } catch (error) {
    console.log("❌ Page: Invalid token - redirecting to login");
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/api/protected-route",
    "/dashboard/:path*",
    "/admin/:path*"
    // Product API is handled separately in the middleware logic
  ]
};








// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET as string;

// export function middleware(req: NextRequest) {
//   const token = req.cookies.get("token")?.value;

//   if (!token) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     jwt.verify(token, JWT_SECRET);
//     return NextResponse.next();
//   } catch (error) {
//     return NextResponse.json({ message: "Invalid token" }, { status: 401 });
//   }
// }

// export const config = {
//   matcher: "/api/protected-route", // Adjust based on protected routes
// };


