/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.pexels.com", "i.pinimg.com","v1.pinimg.com"],
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
   eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
  
};

module.exports = nextConfig;
