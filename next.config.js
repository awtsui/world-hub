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
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_VERCEL_URL
      ? process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
        ? 'worldhub.app'
        : process.env.NEXT_PUBLIC_VERCEL_URL
      : 'localhost:3000',
  },
};

module.exports = nextConfig;
