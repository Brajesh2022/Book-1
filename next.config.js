/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['annas-archive.org', 'placehold.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig