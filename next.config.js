/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 👈 THIS IS REQUIRED FOR DESKTOP
  images: {
    domains: ['i.ytimg.com', 'img.youtube.com'],
    unoptimized: true,
  },
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
}

module.exports = nextConfig