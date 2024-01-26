/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd7kqasaq9wy32.cloudfront.net',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_VERCEL_URL || 'localhost:3000',
    NODE_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',
  },
};

module.exports = nextConfig;
