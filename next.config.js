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
};

module.exports = nextConfig;
