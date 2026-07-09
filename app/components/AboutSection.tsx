'use client'

import { 
  FaYoutube, 
  FaFacebook, 
  FaInstagram, 
  FaTiktok, 
  FaTwitter, 
  FaReddit, 
  FaLinkedin, 
  FaSnapchat, 
  FaPinterest, 
  FaTelegram, 
  FaDiscord, 
  FaQuora,
  FaGithub,
  FaShieldAlt,
  FaRocket,
  FaDatabase,
  FaCloudDownloadAlt,
  FaGlobe,
  FaVideo,
  FaMusic,
  FaImage,
  FaUsers,
  FaHeart,
  FaStar,
  FaAward,
  FaInfinity
} from 'react-icons/fa'

const supportedSites = [
  { name: 'YouTube', icon: FaYoutube, color: 'text-red-600 dark:text-red-400' },
  { name: 'Facebook', icon: FaFacebook, color: 'text-blue-600 dark:text-blue-400' },
  { name: 'Instagram', icon: FaInstagram, color: 'text-pink-600 dark:text-pink-400' },
  { name: 'TikTok', icon: FaTiktok, color: 'text-black dark:text-white' },
  { name: 'X (Twitter)', icon: FaTwitter, color: 'text-blue-400 dark:text-blue-300' },
  { name: 'Reddit', icon: FaReddit, color: 'text-orange-600 dark:text-orange-400' },
  { name: 'LinkedIn', icon: FaLinkedin, color: 'text-blue-700 dark:text-blue-300' },
  { name: 'Snapchat', icon: FaSnapchat, color: 'text-yellow-500 dark:text-yellow-400' },
  { name: 'Pinterest', icon: FaPinterest, color: 'text-red-500 dark:text-red-400' },
  { name: 'Telegram', icon: FaTelegram, color: 'text-blue-500 dark:text-blue-400' },
  { name: 'Discord', icon: FaDiscord, color: 'text-indigo-500 dark:text-indigo-400' },
  { name: 'Quora', icon: FaQuora, color: 'text-red-600 dark:text-red-400' },
]

export default function AboutSection() {
  return (
    <section id="about" className="py-16 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 text-white p-4 rounded-2xl shadow-lg">
            <FaRocket className="w-12 h-12" />
          </div>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
          About MediaDash
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-medium">
          MediaDash is a powerful, free, and easy-to-use media downloader that supports over 1000 websites. 
          Download videos, audio, and thumbnails in high quality with just one click.
        </p>
      </div>

      {/* What is MediaDash */}
      <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 mb-12 shadow-lg border border-gray-100 dark:border-gray-700">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
          What is MediaDash?
        </h3>
        <div className="text-center max-w-4xl mx-auto">
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            MediaDash is a universal media downloader designed to make downloading content from the internet 
            simple, fast, and accessible for everyone. Whether you're a content creator, educator, student, 
            or just someone who wants to save their favorite videos for offline viewing, MediaDash provides 
            a seamless experience.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            Built with cutting-edge technology, MediaDash can extract media from over 1000 websites, 
            including all major social media platforms. The service handles everything automatically - 
            from fetching the highest quality available to merging video and audio streams when needed.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            With its smart caching system, MediaDash remembers previously downloaded content, 
            making subsequent downloads of the same video instant. This means you spend less time waiting 
            and more time enjoying your content.
          </p>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700">
          <div className="text-4xl mb-4 text-blue-600 dark:text-blue-400 flex justify-center">
            <FaCloudDownloadAlt />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Universal Downloader</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
            Download from YouTube, Facebook, Instagram, TikTok, Twitter, Reddit, LinkedIn, 
            Snapchat, Pinterest, Telegram, Discord, Quora and 1000+ more platforms
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700">
          <div className="text-4xl mb-4 text-green-600 dark:text-green-400 flex justify-center">
            <FaVideo />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Multiple Qualities</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
            Download videos in 360p, 480p, 720p, 1080p, 2K, 4K and 8K. 
            Extract audio in 128kbps, 192kbps, 256kbps and 320kbps MP3 quality
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700">
          <div className="text-4xl mb-4 text-purple-600 dark:text-purple-400 flex justify-center">
            <FaDatabase />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Smart Caching</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
            Automatic caching with 5GB limit and 24-hour expiration. 
            Previously downloaded content is served instantly from cache
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700">
          <div className="text-4xl mb-4 text-orange-600 dark:text-orange-400 flex justify-center">
            <FaShieldAlt />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Secure & Private</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
            No registration required, no tracking, no data collection. 
            Your privacy is our top priority
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700">
          <div className="text-4xl mb-4 text-pink-600 dark:text-pink-400 flex justify-center">
            <FaImage />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Thumbnail Extraction</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
            Extract high-resolution thumbnails from any video instantly. 
            Perfect for content creators and designers
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700">
          <div className="text-4xl mb-4 text-cyan-600 dark:text-cyan-400 flex justify-center">
            <FaGlobe />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">100% Free</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
            Completely free to use with no hidden fees, no subscriptions, 
            and no download limits. Forever free for everyone
          </p>
        </div>
      </div>

      {/* Supported Platforms */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
          Supported Platforms
        </h3>
        <p className="text-center max-w-2xl mx-auto text-gray-600 dark:text-gray-300 mb-6">
          MediaDash supports over 1000 websites. Here are some of the most popular:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {supportedSites.map((site) => (
            <div key={site.name} className="bg-white dark:bg-gray-800/50 rounded-xl p-4 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700">
              <site.icon className={`w-8 h-8 mx-auto mb-2 ${site.color}`} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{site.name}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          And many more... <FaInfinity className="inline ml-1 text-blue-600 dark:text-blue-400" />
        </p>
      </div>

      {/* Why Choose MediaDash */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-2xl p-8 mb-12 border border-blue-100 dark:border-blue-800">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
          Why Choose MediaDash?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-3 flex justify-center">🚀</div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Fast & Efficient</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
              Powered by yt-dlp technology for the fastest download speeds. 
              Smart caching makes repeated downloads instant
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3 flex justify-center">🎯</div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">All Qualities Available</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
              From 360p to 8K video and 128kbps to 320kbps audio. 
              Choose exactly what you need
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3 flex justify-center">💡</div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Easy to Use</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
              Simple copy-paste interface. No technical knowledge required. 
              Just paste the URL and click download
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 mb-12 shadow-lg border border-gray-100 dark:border-gray-700">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
          Built with Modern Technology
        </h3>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          MediaDash is built with cutting-edge technologies to ensure the best performance and user experience
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
            <div className="text-2xl mb-2">⚛️</div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Next.js 14</span>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
            <div className="text-2xl mb-2">📘</div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">TypeScript</span>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
            <div className="text-2xl mb-2">🎨</div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tailwind CSS</span>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
            <div className="text-2xl mb-2">🎬</div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">yt-dlp</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 text-center shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">1000+</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Supported Websites</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 text-center shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">∞</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Free Downloads</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 text-center shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">8K</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Maximum Video Quality</p>
        </div>
      </div>

      {/* Community */}
      <div className="text-center bg-white dark:bg-gray-800/50 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex justify-center mb-4">
          <div className="flex space-x-3">
            <FaUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <FaHeart className="w-6 h-6 text-red-500 dark:text-red-400" />
            <FaStar className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
            <FaAward className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Join the MediaDash Community
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl mx-auto">
          MediaDash is completely free and open source. We believe in making media accessible to everyone.
        </p>
        <div className="flex justify-center space-x-4">
          <a 
            href="#" 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800 dark:bg-gray-700 text-white rounded-xl hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105 shadow-md"
          >
            <FaGithub />
            GitHub
          </a>
          <a 
            href="#" 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 hover:scale-105 shadow-md"
          >
            <FaGlobe />
            Website
          </a>
        </div>
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Made with ❤️ for content creators everywhere
        </p>
      </div>
    </section>
  )
}