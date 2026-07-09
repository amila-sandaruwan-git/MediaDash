/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.ytimg.com', 'img.youtube.com'],
    unoptimized: true,
  },
  // Remove or comment out: output: 'export',
  // output: 'export',  // ← COMMENT THIS OUT
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
}

module.exports = nextConfig