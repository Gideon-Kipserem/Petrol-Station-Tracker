/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5555/api/:path*', // Proxy to Flask backend
      },
    ]
  },
}

module.exports = nextConfig
