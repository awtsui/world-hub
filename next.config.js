/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ticketweb.com',
      },
      {
        protocol: 'https',
        hostname: 's1.ticketm.net',
      },
    ],
  },
};

module.exports = nextConfig;
