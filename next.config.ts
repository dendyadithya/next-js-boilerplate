import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'dev-api-itrsc.rsudcideres.id',
        port: '7771'
      }
    ]
  }
}

export default nextConfig
