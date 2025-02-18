import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  // reactStrictMode: false,
  images: {
    // domains: ['utfs.io'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '/f/**',
      },
    ],
  },
}

export default nextConfig
