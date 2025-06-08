// // middleware.ts
// import { NextResponse } from 'next/server';
// import { getSession } from 'next-auth/react'; // Adjust this import based on your auth setup

// export async function middleware(request) {
//     const session = await getSession({ req: request });

//     // If the user is not authenticated and trying to access the homepage
//     if (!session && request.nextUrl.pathname === '/') {
//         return NextResponse.redirect(new URL('/auth', request.url)); // Redirect to the auth page
//     }

//     return NextResponse.next(); // Continue to the requested page if authenticated or not on the homepage
// }

// export const config = {
//     matcher: '/', // Apply this middleware only for the homepage
// };
