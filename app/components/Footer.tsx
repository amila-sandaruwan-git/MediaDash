'use client'

import { FaGithub, FaTwitter, FaYoutube, FaHeart, FaEnvelope, FaDiscord, FaRocket } from 'react-icons/fa'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-teal-200 dark:bg-gray-900/100 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-800/50 mt-16 overflow-hidden">
      {/* Subtle gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
      
      {/* Background glow effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* ============================================
              Column 1 - Brand
              ============================================ */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <span className="text-white text-lg">🎬</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  MediaDash
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wider uppercase">
                  Universal Downloader
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed">
              Download videos, audio &amp; thumbnails from 1000+ platforms including YouTube, Facebook, Instagram, TikTok, and more.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full font-medium">
                
              </span>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full font-medium">
                
              </span>
            </div>
          </div>

          {/* ============================================
              Column 2 - Quick Links
              ============================================ */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('help')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                >
                  Help &amp; Guide
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('install')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                >
                  Install App
                </button>
              </li>
              <li>
                <a 
                  href="https://github.com/amila-sandaruwan-git/MediaDash" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* ============================================
              Column 3 - Support & Legal
              ============================================ */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                
              </li>
              <li>
                
              </li>
              <li>
                
              </li>
              <li>
                <a 
                  href="mailto:support@mediadash.com" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform flex items-center gap-1"
                >
                  <FaEnvelope className="w-3 h-3" />
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ============================================
            Divider with social icons
            ============================================ */}
        <div className="mt-10 pt-8 border-t border-gray-200/50 dark:border-gray-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com/amila-sandaruwan-git/MediaDash" 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="GitHub"
              >
                <FaGithub className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-gray-800 dark:bg-gray-700 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  GitHub
                </span>
              </a>
              <a 
                href="#" 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="Twitter"
              >
                <FaTwitter className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-400 dark:group-hover:text-blue-300 transition-colors" />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-gray-800 dark:bg-gray-700 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Twitter
                </span>
              </a>
              <a 
                href="#" 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="YouTube"
              >
                <FaYoutube className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-gray-800 dark:bg-gray-700 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  YouTube
                </span>
              </a>
              <a 
                href="#" 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="Discord"
              >
                <FaDiscord className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-gray-800 dark:bg-gray-700 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Discord
                </span>
              </a>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                
                
              </span>
            </div>
          </div>
        </div>

        {/* ============================================
            Copyright
            ============================================ */}
        <div className="mt-8 pt-6 border-t border-gray-200/30 dark:border-gray-800/30 text-center">
          
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            &copy; {currentYear} MediaDash. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            Built with using Next.js, Electron &amp; yt-dlp
          </p>
        </div>
      </div>
    </footer>
  )
}