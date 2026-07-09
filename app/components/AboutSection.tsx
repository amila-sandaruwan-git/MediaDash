//app/components/AboutSection.tsx

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
  FaQuora 
} from 'react-icons/fa'

const supportedSites = [
  { name: 'YouTube', icon: FaYoutube, color: 'text-red-600' },
  { name: 'Facebook', icon: FaFacebook, color: 'text-blue-600' },
  { name: 'Instagram', icon: FaInstagram, color: 'text-pink-600' },
  { name: 'TikTok', icon: FaTiktok, color: 'text-black dark:text-white' },
  { name: 'X (Twitter)', icon: FaTwitter, color: 'text-blue-400' },
  { name: 'Reddit', icon: FaReddit, color: 'text-orange-600' },
  { name: 'LinkedIn', icon: FaLinkedin, color: 'text-blue-700' },
  { name: 'Snapchat', icon: FaSnapchat, color: 'text-yellow-500' },
  { name: 'Pinterest', icon: FaPinterest, color: 'text-red-500' },
  { name: 'Telegram', icon: FaTelegram, color: 'text-blue-500' },
  { name: 'Discord', icon: FaDiscord, color: 'text-indigo-500' },
  { name: 'Quora', icon: FaQuora, color: 'text-red-600' },
]

export default function AboutSection() {
  return (
    <section id="about" className="py-16 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">About MediaDash</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          MediaDash is a powerful, free, and easy-to-use media downloader that supports over 1000 websites. 
          Download videos, audio, and thumbnails in high quality with just one click.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {supportedSites.map((site) => (
          <div key={site.name} className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md hover:shadow-xl transition-shadow">
            <site.icon className={`w-8 h-8 mx-auto mb-2 ${site.color}`} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{site.name}</span>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Why Choose MediaDash?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <div className="text-3xl mb-2">🚀</div>
            <h4 className="font-semibold text-gray-900 dark:text-white">Fast & Free</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">No registration, no limits, completely free</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🔒</div>
            <h4 className="font-semibold text-gray-900 dark:text-white">Secure & Private</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Your data is safe, we don&apos;t store any files</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🎯</div>
            <h4 className="font-semibold text-gray-900 dark:text-white">All Qualities</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">From 360p to 8K, all audio bitrates available</p>
          </div>
        </div>
      </div>
    </section>
  )
}