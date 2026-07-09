//app/components/Footer.tsx

'use client'

import { FaGithub, FaTwitter, FaYoutube, FaHeart } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              MediaDash
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Download videos, audio &amp; thumbnails from anywhere
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <FaGithub className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <FaTwitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <FaYoutube className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
          <p className="flex items-center justify-center gap-1">
            Made with <FaHeart className="text-red-500 w-4 h-4" /> for content creators everywhere
          </p>
          <p className="mt-1">
            &copy; {new Date().getFullYear()} MediaDash. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}