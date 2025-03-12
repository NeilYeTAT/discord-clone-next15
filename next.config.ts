import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '/f/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
