/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove rewrites since we're using direct API calls to Render backend
  // The API base URL is configured in src/app/Lib/api.js
}

module.exports = nextConfig
