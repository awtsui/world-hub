/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'world-hub-storage.s3.us-east-1.amazonaws.com',
      },
    ],
  },
};

module.exports = nextConfig;
