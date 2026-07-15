'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { FaSpinner } from 'react-icons/fa'

interface HeroSectionProps {
  onConvert: (url: string) => void
  isLoading: boolean
}

export default function HeroSection({ onConvert, isLoading }: HeroSectionProps) {
  const [url, setUrl] = useState('')
  const [isPasted, setIsPasted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastConvertedUrlRef = useRef<string>('')
  
  // 🔥 Track if conversion is pending
  const isConvertingRef = useRef(false)

  // ============================================
  // CLEAN UP ON UNMOUNT
  // ============================================
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // ============================================
  // MAIN AUTO-CONVERT LOGIC - CLEAN & FAST
  // ============================================
  useEffect(() => {
    // Clear previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }

    const trimmed = url.trim()

    // Skip if:
    if (!trimmed || trimmed.length < 5 || isLoading || isConvertingRef.current) {
      return
    }

    if (trimmed === lastConvertedUrlRef.current) {
      return
    }

    // Quick URL validation
    let isValidUrl = false
    try {
      new URL(trimmed)
      isValidUrl = true
    } catch {
      const platforms = ['youtube.com', 'youtu.be', 'reddit.com', 'redd.it',
        'facebook.com', 'fb.watch', 'instagram.com', 'instagr.am',
        'tiktok.com', 'vm.tiktok.com', 'twitter.com', 'x.com',
        'linkedin.com', 'pinterest.com', 'snapchat.com',
        'telegram.org', 't.me', 'discord.com', 'discord.gg', 'quora.com']
      isValidUrl = platforms.some(p => trimmed.includes(p))
    }

    if (!isValidUrl) {
      setIsPasted(false)
      return
    }

    // 🔥 If pasted, convert instantly (no debounce)
    if (isPasted) {
      isConvertingRef.current = true
      lastConvertedUrlRef.current = trimmed
      onConvert(trimmed)
      setIsPasted(false)
      // Reset after a short delay
      setTimeout(() => {
        isConvertingRef.current = false
      }, 100)
      return
    }

    // 🔥 Typing: debounce 300ms
    debounceTimerRef.current = setTimeout(() => {
      isConvertingRef.current = true
      lastConvertedUrlRef.current = trimmed
      onConvert(trimmed)
      setTimeout(() => {
        isConvertingRef.current = false
      }, 100)
    }, 300)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [url, isLoading, isPasted, onConvert])

  // ============================================
  // HANDLE PASTE - INSTANT CONVERSION
  // ============================================
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text').trim()
    if (!text || text.length < 5) return

    // 🔥 Prevent default to avoid double paste
    e.preventDefault()

    // Set URL and mark as pasted
    setUrl(text)
    setIsPasted(true)
    lastConvertedUrlRef.current = text
    
    // 🔥 Convert instantly - no delay!
    isConvertingRef.current = true
    onConvert(text)
    
    // Reset after a short delay
    setTimeout(() => {
      isConvertingRef.current = false
    }, 100)
  }, [onConvert])

  // ============================================
  // HANDLE SUBMIT
  // ============================================
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed || isLoading || isConvertingRef.current) return

    isConvertingRef.current = true
    lastConvertedUrlRef.current = trimmed
    setIsPasted(false)
    onConvert(trimmed)
    setTimeout(() => {
      isConvertingRef.current = false
    }, 100)
  }, [url, isLoading, onConvert])

  // ============================================
  // HANDLE CHANGE
  // ============================================
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setUrl(newValue)
    if (isPasted) {
      setIsPasted(false)
    }
  }, [isPasted])

  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Download Videos, Audio &amp; Thumbnails
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 font-medium">
          Paste any URL from <span className="text-blue-600 dark:text-blue-400 font-semibold">YouTube</span>, <span className="text-pink-600 dark:text-pink-400 font-semibold">Facebook</span>, <span className="text-purple-600 dark:text-purple-400 font-semibold">Instagram</span>, <span className="text-black dark:text-white font-semibold">TikTok</span> and <span className="text-orange-600 dark:text-orange-400 font-semibold">1000+</span> more
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              placeholder="Paste video or audio URL here..."
              value={url}
              onChange={handleChange}
              onPaste={handlePaste}
              className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg shadow-lg hover:shadow-xl"
            />
            {isPasted && !isLoading && url.trim() && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                
              </div>
            )}
            {isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <FaSpinner className="animate-spin text-blue-500 w-5 h-5" />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 hover:from-blue-500 hover:via-indigo-400 hover:to-purple-500 text-white font-bold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl hover:scale-105 transform min-w-[160px]"
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

        {isPasted && !isLoading && url.trim() && (
          <div className="mt-3 text-sm text-green-600 dark:text-green-400 animate-fadeIn">
            
          </div>
        )}

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

        <div className="mt-4 text-xs text-gray-400 dark:text-gray-500">
           Paste a URL to auto-convert instantly
        </div>
      </div>
    </section>
  )
}