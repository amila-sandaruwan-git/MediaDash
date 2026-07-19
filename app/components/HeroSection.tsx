'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { FaSpinner } from 'react-icons/fa'
import Image from 'next/image'

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
  
  // Track if conversion is pending
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

    // If pasted, convert instantly (no debounce)
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

    // Typing: debounce 300ms
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

    // Prevent default to avoid double paste
    e.preventDefault()

    // Set URL and mark as pasted
    setUrl(text)
    setIsPasted(true)
    lastConvertedUrlRef.current = text
    
    // Convert instantly - no delay!
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
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-16 overflow-hidden">
      {/* ============================================
          BACKGROUND IMAGE
          ============================================ */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <Image
            src="/image1.jpg"
            alt="Background"
            fill
            priority
            className="object-cover scale-105 blur-[1px] opacity-80 dark:opacity-65"
            sizes="100vw"
            quality={80}
          />
          {/* Lighter overlay for better visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/20 to-white/20 dark:from-gray-900/70 dark:via-gray-900/50 dark:to-gray-900/80" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
        </div>
      </div>

      {/* ============================================
          CONTENT - IMPROVED HEADING VISIBILITY
          ============================================ */}
      <div className="relative z-10 w-full max-w-3xl mx-auto text-center">
        {/* ============================================
            MAIN HEADING - FIXED VISIBILITY
            ============================================ */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          <span className="
            bg-gradient-to-r from-gray-800 via-gray-800 to-purple-700 
            dark:from-blue-300 dark:via-indigo-300 dark:to-purple-300 
            bg-clip-text text-transparent 
            drop-shadow-2xl
            [text-shadow:_0_4px_20px_rgba(255,255,255,0.9),_0_0_40px_rgba(255,255,255,0.3)]
            dark:[text-shadow:_0_4px_20px_rgba(0,0,0,0.7)]
          ">
            Download Videos, Audio &amp; Thumbnails
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl mb-8 font-semibold drop-shadow-2xl px-2
          text-gray-800 dark:text-gray-100
          [text-shadow:_0_2px_12px_rgba(255,255,255,0.9)]
          dark:[text-shadow:_0_2px_12px_rgba(0,0,0,0.6)]">
          Paste any URL from{' '}
          <span className="text-red-700 dark:text-red-700 font-bold drop-shadow-lg">YouTube</span>,{' '}
          <span className="text-blue-700 dark:text-blue-700 font-bold drop-shadow-lg">Facebook</span>,{' '}
          <span className="text-purple-700 dark:text-purple-300 font-bold drop-shadow-lg">Instagram</span>,{' '}
          <span className="text-gray-900 dark:text-gray-700 font-bold drop-shadow-lg">TikTok</span>{' '}
          and{' '}
          <span className="text-orange-700 dark:text-orange-300 font-bold drop-shadow-lg">1000+</span> more
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
              className="w-full px-6 py-4 rounded-2xl bg-white/95 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-white/50 dark:border-gray-700/50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/40 dark:focus:ring-blue-400/40 outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg shadow-2xl hover:shadow-3xl"
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <FaSpinner className="animate-spin text-blue-600 dark:text-blue-400 w-5 h-5" />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 hover:from-blue-500 hover:via-indigo-400 hover:to-purple-500 text-white font-bold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transform min-w-[160px]"
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

        {/* Platform tags */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {['YouTube', 'Facebook', 'Instagram', 'TikTok', 'X', 'Reddit', 'LinkedIn'].map((site) => (
            <span 
              key={site} 
              className="px-4 py-1.5 bg-white/85 dark:bg-gray-800/80 backdrop-blur-sm border border-white/50 dark:border-gray-700/50 rounded-full text-sm font-semibold text-gray-800 dark:text-gray-200 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105"
            >
              {site}
            </span>
          ))}
        </div>

        {/* Footer hint */}
        <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 font-medium drop-shadow-2xl
          [text-shadow:_0_2px_8px_rgba(255,255,255,0.9)]
          dark:[text-shadow:_0_2px_8px_rgba(0,0,0,0.6)]">
          💡 Paste a URL to auto-convert instantly
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-gray-500/60 dark:border-gray-400/60 flex justify-center">
          <div className="w-1.5 h-3 bg-gray-500/60 dark:bg-gray-400/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}