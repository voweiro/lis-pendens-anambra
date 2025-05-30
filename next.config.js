/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://147.182.229.165/api/:path*', // Proxy to Backend
      }
    ]
  }
}

module.exports = nextConfig
