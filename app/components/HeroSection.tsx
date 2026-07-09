'use client'

import { useState } from 'react'
import { FaSpinner } from 'react-icons/fa'

interface HeroSectionProps {
  onConvert: (url: string) => void
  isLoading: boolean
}

export default function HeroSection({ onConvert, isLoading }: HeroSectionProps) {
  const [url, setUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      onConvert(url)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Download Videos, Audio & Thumbnails
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 font-medium">
          Paste any URL from <span className="text-blue-600 dark:text-blue-400 font-semibold">YouTube</span>, <span className="text-pink-600 dark:text-pink-400 font-semibold">Facebook</span>, <span className="text-purple-600 dark:text-purple-400 font-semibold">Instagram</span>, <span className="text-black dark:text-white font-semibold">TikTok</span> and <span className="text-orange-600 dark:text-orange-400 font-semibold">1000+</span> more
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="url"
            placeholder="Paste video or audio URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-6 py-4 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg shadow-lg hover:shadow-xl"
            required
          />
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 hover:from-blue-500 hover:via-indigo-400 hover:to-purple-500 text-white font-bold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl hover:scale-105 transform"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" />
                Converting...
              </>
            ) : (
              '🚀 CONVERTER'
            )}
          </button>
        </form>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {['YouTube', 'Facebook', 'Instagram', 'TikTok', 'X', 'Reddit', 'LinkedIn'].map((site) => (
            <span 
              key={site} 
              className="px-4 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              {site}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}