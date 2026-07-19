'use client'

import { FaVideo, FaMusic, FaImage, FaLink, FaDownload, FaReddit, FaCookie } from 'react-icons/fa'

const steps = [
  {
    icon: FaLink,
    title: 'Copy the URL',
    description: 'Copy the video or audio URL from your favorite platform'
  },
  {
    icon: FaDownload,
    title: 'Paste & Convert',
    description: 'Paste the URL in the input box and click "CONVERTER"'
  },
  {
    icon: FaVideo,
    title: 'Choose Quality',
    description: 'Select from available video resolutions (360p to 8K)'
  },
  {
    icon: FaMusic,
    title: 'Download Audio',
    description: 'Extract audio in MP3 format with bitrates up to 320kbps'
  },
  {
    icon: FaImage,
    title: 'Save Thumbnail',
    description: 'Download the video thumbnail in high resolution'
  }
]

export default function HelpSection() {
  return (
    <section id="help" className="py-16 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">How to Use MediaDash</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Download videos, audio, and thumbnails in 3 simple steps
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow relative">
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              {index + 1}
            </div>
            <step.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4 mt-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Platform-Specific Tips */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reddit Tip */}
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <FaReddit className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">🔴 Reddit Videos</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Always paste the <strong>Reddit post page URL</strong>, not the direct video link.
          </p>
          <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded text-xs font-mono text-gray-600 dark:text-gray-400 break-all">
            ✅ https://www.reddit.com/r/videos/comments/123456/...
          </div>
          <div className="mt-1 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs font-mono text-red-600 dark:text-red-400 break-all line-through">
            ❌ https://packaged-media.redd.it/...
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            💡 Direct Reddit links expire quickly. The page URL works every time!
          </p>
        </div>

        {/* General Tip */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <FaDownload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">💡 Pro Tips</h3>
          </div>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <li>• Use the <strong>page URL</strong> (not direct video links) for best results</li>
            <li>• For highest quality, choose <strong>4K or 8K</strong> if available</li>
            <li>• Download audio in <strong>320kbps</strong> for the best sound quality</li>
            <li>• Cached downloads are <strong>instant</strong> - look for the ⚡ badge</li>
          </ul>
        </div>
      </div>

      {/* 🔒 NEW: Cookie Support Section */}
      <div className="mt-6 grid grid-cols-1 gap-6">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <FaCookie className="w-6 h-6 text-green-600 dark:text-green-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">🍪 Access Restricted Videos</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Some platforms (like <strong>OK.ru</strong>, <strong>VK</strong>) require login to download videos. Enable this by:
          </p>
          <ol className="text-sm text-gray-600 dark:text-gray-400 list-decimal list-inside space-y-1 ml-2">
            <li>Install the <strong>"Get cookies.txt"</strong> browser extension</li>
            <li>Log in to the website (e.g., OK.ru)</li>
            <li>Click the extension and export cookies</li>
            <li>Save the file as <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">cookies.txt</code> in the MediaDash folder</li>
          </ol>
          <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded text-xs font-mono text-gray-600 dark:text-gray-400 break-all">
            📁 C:\Users\YourUser\WEB\mediadash\cookies.txt
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            ⚠️ Some videos are permanently restricted and cannot be downloaded even with cookies.
          </p>
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">⚠️ Important: Use Page URLs</h3>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
          <li>For <strong>Reddit</strong>: Use the post page URL, not the direct video link</li>
          <li>For <strong>YouTube</strong>: Use the watch page URL or share link</li>
          <li>For <strong>Instagram</strong>: Use the post or reel URL</li>
          <li>For <strong>TikTok</strong>: Use the video page URL or share link</li>
          <li>For <strong>OK.ru/VK</strong>: Use the video page URL and export cookies for restricted content</li>
          <li>Direct video links often <strong>expire</strong> or require special handling</li>
        </ul>
      </div>
    </section>
  )
}