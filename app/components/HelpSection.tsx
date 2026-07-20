'use client'

import { FaVideo, FaMusic, FaImage, FaLink, FaDownload, FaReddit, FaCookie, FaYoutube, FaInstagram, FaTiktok, FaTwitter, FaFacebook, FaLinkedin, FaArrowRight, FaCheck, FaShieldAlt, FaClock } from 'react-icons/fa'

const steps = [
  {
    icon: FaLink,
    title: 'Copy the URL',
    description: 'Copy the video or audio URL from your favorite platform',
    color: 'from-blue-500 to-cyan-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200/40 dark:border-blue-700/40',
    shadow: 'shadow-blue-500/20',
    iconBg: 'from-blue-500 to-cyan-400',
  },
  {
    icon: FaDownload,
    title: 'Paste & Convert',
    description: 'Paste the URL in the input box and click "CONVERTER"',
    color: 'from-purple-500 to-pink-400',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200/40 dark:border-purple-700/40',
    shadow: 'shadow-purple-500/20',
    iconBg: 'from-purple-500 to-pink-400',
  },
  {
    icon: FaVideo,
    title: 'Choose Quality',
    description: 'Select from available video resolutions (360p to 8K)',
    color: 'from-green-500 to-emerald-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200/40 dark:border-green-700/40',
    shadow: 'shadow-green-500/20',
    iconBg: 'from-green-500 to-emerald-400',
  },
  {
    icon: FaMusic,
    title: 'Download Audio',
    description: 'Extract audio in MP3 format with bitrates up to 320kbps',
    color: 'from-orange-500 to-amber-400',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-orange-200/40 dark:border-orange-700/40',
    shadow: 'shadow-orange-500/20',
    iconBg: 'from-orange-500 to-amber-400',
  },
  {
    icon: FaImage,
    title: 'Save Thumbnail',
    description: 'Download the video thumbnail in high resolution',
    color: 'from-pink-500 to-rose-400',
    bg: 'bg-pink-50 dark:bg-pink-900/20',
    border: 'border-pink-200/40 dark:border-pink-700/40',
    shadow: 'shadow-pink-500/20',
    iconBg: 'from-pink-500 to-rose-400',
  },
]

const platformIcons = [
  { name: 'YouTube', icon: FaYoutube, color: 'text-red-600 dark:text-red-400' },
  { name: 'Facebook', icon: FaFacebook, color: 'text-blue-600 dark:text-blue-400' },
  { name: 'Instagram', icon: FaInstagram, color: 'text-pink-600 dark:text-pink-400' },
  { name: 'TikTok', icon: FaTiktok, color: 'text-black dark:text-white' },
  { name: 'Twitter/X', icon: FaTwitter, color: 'text-sky-500 dark:text-sky-400' },
]

export default function HelpSection() {
  return (
    <section id="help" className="py-20 px-4 max-w-7xl mx-auto">
      {/* ============================================
          HEADER
          ============================================ */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full mb-4 border border-blue-200/30 dark:border-blue-700/30 backdrop-blur-sm">
          <FaShieldAlt className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Step-by-Step Guide</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
          How to Use MediaDash
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Download videos, audio, and thumbnails from any platform in just a few clicks
        </p>
      </div>

      {/* ============================================
          STEPS - ULTRA PREMIUM CARDS
          ============================================ */}
      <div className="relative">
        {/* Connecting line between steps (desktop) */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-20 -translate-y-1/2" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`relative group rounded-2xl p-7 transition-all duration-500 hover:scale-[1.03] ${step.bg} border ${step.border} backdrop-blur-sm hover:shadow-2xl ${step.shadow} hover:shadow-xl`}
            >
              {/* Step number with gradient */}
              <div className={`absolute -top-4 -left-3 w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center font-bold text-sm shadow-lg ${step.shadow} z-10`}>
                {index + 1}
              </div>

              {/* Step number alternative - floating indicator */}
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-center">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Icon with animated pulse */}
              <div className="relative mb-5">
                <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.iconBg} flex items-center justify-center shadow-lg ${step.shadow} relative transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {step.description}
              </p>

              {/* Arrow indicator on hover */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                  <FaArrowRight className="w-3 h-3 text-white" />
                </div>
              </div>

              {/* Progress bar at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/50 dark:bg-gray-700/50 rounded-b-2xl overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${step.color} transition-all duration-1000 group-hover:w-full`}
                  style={{ width: `${((index + 1) / steps.length) * 100}%` }}
                />
              </div>

              {/* Subtle glow on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
            </div>
          ))}
        </div>
      </div>

      {/* ============================================
          QUICK STATS
          ============================================ */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Supported Platforms', value: '1000+', icon: '🌐', color: 'from-blue-500 to-cyan-400' },
          { label: 'Video Quality', value: 'Up to 8K', icon: '🎬', color: 'from-purple-500 to-pink-400' },
          { label: 'Audio Quality', value: '320kbps', icon: '🎵', color: 'from-orange-500 to-amber-400' },
          { label: 'Free Downloads', value: 'Unlimited', icon: '♾️', color: 'from-green-500 to-emerald-400' },
        ].map((stat) => (
          <div 
            key={stat.label} 
            className="group bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-200/30 dark:border-gray-700/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-default"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
            <div className={`text-2xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
            </div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* ============================================
          PLATFORM-SPECIFIC TIPS
          ============================================ */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reddit Tip */}
        <div className="group rounded-2xl p-8 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200/40 dark:border-orange-800/30 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-300">
              <FaReddit className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">🔴 Reddit Videos</h3>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Always paste the <strong className="text-orange-600 dark:text-orange-400">Reddit post page URL</strong>, not the direct video link.
            </p>
            
            <div className="flex flex-col gap-2 text-xs font-mono">
              <div className="p-3 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-green-300/50 dark:border-green-700/50 text-green-700 dark:text-green-400 flex items-center gap-2">
                <span>✅</span>
                <span className="break-all">https://www.reddit.com/r/videos/comments/123456/...</span>
              </div>
              <div className="p-3 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-red-300/50 dark:border-red-700/50 text-red-600 dark:text-red-400 flex items-center gap-2">
                <span>❌</span>
                <span className="break-all line-through">https://packaged-media.redd.it/...</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <FaClock className="w-3 h-3 text-orange-500" />
              Direct Reddit links expire quickly. The page URL works every time!
            </p>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="group rounded-2xl p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/40 dark:border-blue-800/30 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
              <FaDownload className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">💡 Pro Tips</h3>
          </div>
          
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-200">
              <span className="text-blue-500 text-lg font-bold">•</span>
              <span>Use the <strong className="text-blue-600 dark:text-blue-400">page URL</strong> (not direct video links) for best results</span>
            </li>
            <li className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-200">
              <span className="text-purple-500 text-lg font-bold">•</span>
              <span>For highest quality, choose <strong className="text-purple-600 dark:text-purple-400">4K or 8K</strong> if available</span>
            </li>
            <li className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-200">
              <span className="text-pink-500 text-lg font-bold">•</span>
              <span>Download audio in <strong className="text-pink-600 dark:text-pink-400">320kbps</strong> for the best sound quality</span>
            </li>
            <li className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-200">
              <span className="text-green-500 text-lg font-bold">•</span>
              <span>Cached downloads are <strong className="text-green-600 dark:text-green-400">instant</strong> - look for the ⚡ badge</span>
            </li>
          </ul>
        </div>
      </div>

      {/* ============================================
          COOKIE SUPPORT
          ============================================ */}
      <div className="mt-6 group rounded-2xl p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200/40 dark:border-green-800/30 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 hover:scale-[1.005]">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform duration-300">
              <FaCookie className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">🍪 Access Restricted Videos</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Some platforms (like <strong className="text-green-600 dark:text-green-400">OK.ru</strong>, <strong className="text-green-600 dark:text-green-400">VK</strong>) require login to download videos.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {[
                'Install the "Get cookies.txt" browser extension',
                'Log in to the website (e.g., OK.ru)',
                'Click the extension and export cookies',
                'Save as cookies.txt in the MediaDash folder',
              ].map((step, i) => (
                <div key={i} className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl flex items-start gap-2 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200">
                  <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">{step}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-3 p-3 bg-white/80 dark:bg-gray-800/80 rounded-xl text-xs font-mono text-gray-600 dark:text-gray-400 break-all border border-green-200/50 dark:border-green-700/50 flex items-center gap-2">
              <span>📁</span>
              <span>C:\Users\YourUser\WEB\mediadash\cookies.txt</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          IMPORTANT NOTICE
          ============================================ */}
      <div className="mt-6 p-8 rounded-2xl bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border border-yellow-200/40 dark:border-yellow-800/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/20 flex-shrink-0">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Important: Use Page URLs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              {[
                { platform: 'Reddit', tip: 'Use the post page URL, not the direct video link' },
                { platform: 'YouTube', tip: 'Use the watch page URL or share link' },
                { platform: 'Instagram', tip: 'Use the post or reel URL' },
                { platform: 'TikTok', tip: 'Use the video page URL or share link' },
                { platform: 'OK.ru/VK', tip: 'Use video page URL and export cookies' },
                { platform: 'Direct Links', tip: 'Often expire or require special handling' },
              ].map((item) => (
                <div key={item.platform} className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl flex items-start gap-2 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200">
                  <span className="text-yellow-600 dark:text-yellow-400 text-lg font-bold">•</span>
                  <span>
                    <strong className="text-gray-800 dark:text-gray-200">{item.platform}:</strong>{' '}
                    <span className="text-gray-600 dark:text-gray-400">{item.tip}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          SUPPORTED PLATFORMS
          ============================================ */}
      <div className="mt-12 p-8 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30 shadow-lg">
        <h3 className="text-center text-xl font-bold text-gray-900 dark:text-white mb-6">
          Supported Platforms
        </h3>
        <div className="flex flex-wrap justify-center gap-6">
          {platformIcons.map((platform) => (
            <div key={platform.name} className="flex flex-col items-center gap-1 group hover:scale-110 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-white/50 dark:bg-gray-800/50 flex items-center justify-center shadow-md group-hover:shadow-xl transition-all duration-300 border border-gray-200/30 dark:border-gray-700/30">
                <platform.icon className={`w-6 h-6 ${platform.color}`} />
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{platform.name}</span>
            </div>
          ))}
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
              <span className="text-xl font-bold text-white">+</span>
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">1000 More</span>
          </div>
        </div>
      </div>
    </section>
  )
}