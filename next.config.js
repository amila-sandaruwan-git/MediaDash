/** @type {import('next').NextConfig} */
const nextConfig = {
  // ❌ Comment this out or remove it
  // output: 'export',
  
  images: {
    domains: ['i.ytimg.com', 'img.youtube.com'],
    unoptimized: true,
  },
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
}

module.exports = nextConfig