'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
<<<<<<< HEAD
import { FaSpinner, FaTimes, FaDownload, FaMusic, FaImage, FaYoutube, FaFacebook, FaInstagram, FaTiktok, FaTwitter, FaReddit, FaLinkedin } from 'react-icons/fa'
=======
import { FaSpinner, FaTimes } from 'react-icons/fa'
>>>>>>> 808d9f662b4d984e08923e6b29b1d90dbc84b397
import Image from 'next/image'

interface HeroSectionProps {
  onConvert: (url: string) => void
  isLoading: boolean
  error?: { message: string; suggestion?: string } | null
}

export default function HeroSection({ onConvert, isLoading, error }: HeroSectionProps) {
  const [url, setUrl] = useState('')
  const [isPasted, setIsPasted] = useState(false)
  const [displayError, setDisplayError] = useState<{ message: string; suggestion?: string } | null>(null)
<<<<<<< HEAD
  const [isFocused, setIsFocused] = useState(false)
=======
>>>>>>> 808d9f662b4d984e08923e6b29b1d90dbc84b397
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastConvertedUrlRef = useRef<string>('')
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const isConvertingRef = useRef(false)

  // ============================================
  // HANDLE ERROR WITH AUTO-CLOSE
  // ============================================
  useEffect(() => {
<<<<<<< HEAD
=======
    // Clear any existing timeout
>>>>>>> 808d9f662b4d984e08923e6b29b1d90dbc84b397
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current)
      errorTimeoutRef.current = null
    }

    if (error) {
      setDisplayError(error)
<<<<<<< HEAD
=======
      
      // Auto-close after 5 seconds
>>>>>>> 808d9f662b4d984e08923e6b29b1d90dbc84b397
      errorTimeoutRef.current = setTimeout(() => {
        setDisplayError(null)
        errorTimeoutRef.current = null
      }, 5000)
    } else {
      setDisplayError(null)
    }

    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
        errorTimeoutRef.current = null
      }
    }
  }, [error])

  // ============================================
  // MANUAL CLOSE ERROR
  // ============================================
  const closeError = useCallback(() => {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current)
      errorTimeoutRef.current = null
    }
    setDisplayError(null)
  }, [])

  // ============================================
  // CLEAN UP ON UNMOUNT
  // ============================================
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
      }
    }
  }, [])

  // ============================================
  // MAIN AUTO-CONVERT LOGIC
  // ============================================
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }

    const trimmed = url.trim()

    if (!trimmed || trimmed.length < 5 || isLoading || isConvertingRef.current) {
      return
    }

    if (trimmed === lastConvertedUrlRef.current) {
      return
    }

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

    if (isPasted) {
      isConvertingRef.current = true
      lastConvertedUrlRef.current = trimmed
      onConvert(trimmed)
      setIsPasted(false)
      setTimeout(() => {
        isConvertingRef.current = false
      }, 100)
      return
    }

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
  // HANDLE PASTE
  // ============================================
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text').trim()
    if (!text || text.length < 5) return

    e.preventDefault()
    setUrl(text)
    setIsPasted(true)
    lastConvertedUrlRef.current = text
    
    isConvertingRef.current = true
    onConvert(text)
    
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

  // Platform icons mapping
  const platformIcons: Record<string, any> = {
    'YouTube': FaYoutube,
    'Facebook': FaFacebook,
    'Instagram': FaInstagram,
    'TikTok': FaTiktok,
    'X': FaTwitter,
    'Reddit': FaReddit,
    'LinkedIn': FaLinkedin,
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-16 overflow-hidden">
      {/* ============================================
<<<<<<< HEAD
          BACKGROUND - PREMIUM
=======
          BACKGROUND IMAGE - z-0
>>>>>>> 808d9f662b4d984e08923e6b29b1d90dbc84b397
          ============================================ */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <Image
            src="/image1.jpg"
            alt="Background"
            fill
            priority
<<<<<<< HEAD
            className="object-cover scale-110 blur-[2px] opacity-100 dark:opacity-90"
=======
            className="object-cover scale-105 blur-[2px] opacity-80 dark:opacity-65"
>>>>>>> 808d9f662b4d984e08923e6b29b1d90dbc84b397
            sizes="100vw"
            quality={100}
          />
<<<<<<< HEAD
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-white/50 dark:from-gray-900/50 dark:via-gray-900/30 dark:to-gray-900/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 via-purple-500/5 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
=======
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/70 dark:from-gray-900/70 dark:via-gray-900/50 dark:to-gray-900/80" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
>>>>>>> 808d9f662b4d984e08923e6b29b1d90dbc84b397
        </div>
      </div>

      {/* ============================================
<<<<<<< HEAD
          CONTENT
=======
          CONTENT - z-10 (ABOVE IMAGE)
>>>>>>> 808d9f662b4d984e08923e6b29b1d90dbc84b397
          ============================================ */}
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        {/* ============================================
<<<<<<< HEAD
            ERROR MESSAGE
            ============================================ */}
        {displayError && (
          <div className="relative z-50 mb-6 p-5 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-red-200/50 dark:border-red-800/50 rounded-2xl shadow-2xl animate-fadeIn max-w-3xl mx-auto">
            <button
              onClick={closeError}
              className="absolute top-3 right-3 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
=======
            ERROR MESSAGE - AUTO-CLOSE AFTER 5 SECONDS
            ============================================ */}
        {displayError && (
          <div className="relative z-50 mb-4 p-4 bg-red-50/95 dark:bg-red-900/40 backdrop-blur-sm border border-red-200 dark:border-red-800 rounded-2xl shadow-2xl animate-fadeIn">
            <button
              onClick={closeError}
              className="absolute top-2 right-3 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              aria-label="Close error"
            >
              <FaTimes className="w-4 h-4" />
            </button>
            <p className="text-red-700 dark:text-red-300 font-medium flex items-center justify-center gap-2 pr-6">
              <span className="text-xl">⚠️</span>
              {displayError.message}
              {displayError.suggestion && (
                <span className="text-sm text-red-600 dark:text-red-400 ml-2">
                  💡 {displayError.suggestion}
                </span>
              )}
            </p>
            {/* Progress bar for auto-close timer */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-200 dark:bg-red-800/50 rounded-b-2xl overflow-hidden">
              <div 
                className="h-full bg-red-500 dark:bg-red-400 rounded-b-2xl animate-shrink-width"
                style={{ 
                  animationDuration: '5s',
                  animationFillMode: 'forwards'
                }}
              />
            </div>
          </div>
        )}

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          <span className="
            bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 
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
          <span className="text-blue-700 dark:text-blue-300 font-bold drop-shadow-lg">YouTube</span>,{' '}
          <span className="text-pink-700 dark:text-pink-300 font-bold drop-shadow-lg">Facebook</span>,{' '}
          <span className="text-purple-700 dark:text-purple-300 font-bold drop-shadow-lg">Instagram</span>,{' '}
          <span className="text-gray-900 dark:text-white font-bold drop-shadow-lg">TikTok</span>{' '}
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
>>>>>>> 808d9f662b4d984e08923e6b29b1d90dbc84b397
            >
              <FaTimes className="w-4 h-4" />
            </button>
            <p className="text-red-700 dark:text-red-300 font-medium flex items-center justify-center gap-3 pr-8 flex-wrap">
              <span className="text-2xl">⚠️</span>
              <span>{displayError.message}</span>
              {displayError.suggestion && (
                <span className="text-sm bg-red-100/50 dark:bg-red-800/30 px-3 py-1 rounded-full">
                  💡 {displayError.suggestion}
                </span>
              )}
            </p>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-200 dark:bg-red-800/50 rounded-b-2xl overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-red-300 rounded-b-2xl animate-shrink-width"
                style={{ animationDuration: '5s', animationFillMode: 'forwards' }}
              />
            </div>
          </div>
        )}

        <div className="text-center">
          {/* ============================================
              BADGE
              ============================================ */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 rounded-full shadow-xl">
            
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 tracking-wider uppercase">
              🎯 100% Free • No Sign-up • Unlimited Downloads
            </span>
          </div>

          {/* ============================================
              MAIN HEADING - WITH STRONG DARK SHADOW
              ============================================ */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 tracking-tight">
            <span className="
              bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 
              dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 
              bg-clip-text text-transparent 
              drop-shadow-2xl
              [text-shadow:_0_4px_40px_rgba(0,0,0,0.3),_0_0_80px_rgba(0,0,0,0.15),_0_2px_10px_rgba(0,0,0,0.2)]
              dark:[text-shadow:_0_4px_40px_rgba(0,0,0,0.5),_0_0_80px_rgba(0,0,0,0.3)]
            ">
              Download Videos,<br />
              Audio &amp; Thumbnails
            </span>
          </h1>

          {/* ============================================
              SUBTITLE - WITH STRONG DARK SHADOW
              ============================================ */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 font-medium px-4
            text-gray-800/95 dark:text-gray-100/95
            [text-shadow:_0_2px_20px_rgba(0,0,0,0.15),_0_4px_30px_rgba(255,255,255,0.3)]
            dark:[text-shadow:_0_2px_30px_rgba(0,0,0,0.6)]">
            Paste any URL from{' '}
            <span className="inline-flex items-center gap-1 text-red-800 dark:text-red-800 font-bold hover:scale-105 transition-transform duration-200 cursor-default">
              YouTube
            </span>
            <span className="text-gray-400 dark:text-gray-500 mx-1.5">•</span>
            <span className="inline-flex items-center gap-1 text-blue-800 dark:text-blue-800 font-bold hover:scale-105 transition-transform duration-200 cursor-default">
              Facebook
            </span>
            <span className="text-gray-400 dark:text-gray-500 mx-1.5">•</span>
            <span className="inline-flex items-center gap-1 text-purple-800 dark:text-purple-800 font-bold hover:scale-105 transition-transform duration-200 cursor-default">
              Instagram
            </span>
            <span className="text-gray-400 dark:text-gray-500 mx-1.5">•</span>
            <span className="inline-flex items-center gap-1 text-black dark:text-white font-bold hover:scale-105 transition-transform duration-200 cursor-default">
              TikTok
            </span>
            <span className="text-gray-400 dark:text-gray-500 mx-1.5">•</span>
            <span className="inline-flex items-center gap-1 text-orange-600 dark:text-orange-400 font-bold hover:scale-105 transition-transform duration-200 cursor-default">
              1000+
            </span>
            <span className="text-gray-600 dark:text-gray-300">more</span>
          </p>

          {/* ============================================
              SEARCH FORM
              ============================================ */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
            <div className="flex-1 relative group">
              <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur transition-all duration-500 ${
                isFocused ? 'opacity-60' : 'opacity-20'
              }`}></div>
              
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="url"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="🔗 Paste video or audio URL here..."
                  value={url}
                  onChange={handleChange}
                  onPaste={handlePaste}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full px-6 py-4.5 pr-14 rounded-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-2 border-white/60 dark:border-gray-700/60 focus:border-blue-500/60 dark:focus:border-blue-400/60 focus:ring-4 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base md:text-lg shadow-2xl"
                />
                
                {isLoading && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <FaSpinner className="animate-spin text-blue-600 dark:text-blue-400 w-5 h-5" />
                  </div>
                )}

                {isPasted && !isLoading && url.trim() && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full animate-pulse">
                      ✓ Pasted
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="relative px-8 py-4.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 hover:from-blue-500 hover:via-indigo-400 hover:to-purple-500 text-white font-bold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base md:text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transform min-w-[180px] group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <span className="text-xl">🚀</span>
                  <span>CONVERTER</span>
                </>
              )}
            </button>
          </form>

          {/* ============================================
              PLATFORM TAGS
              ============================================ */}
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            {['YouTube', 'Facebook', 'Instagram', 'TikTok', 'X', 'Reddit', 'LinkedIn'].map((site) => {
              const Icon = platformIcons[site]
              return (
                <span 
                  key={site} 
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/50 dark:border-gray-700/50 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/90 dark:hover:bg-gray-800/90 cursor-default group"
                >
                  {Icon && <Icon className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />}
                  <span>{site}</span>
                </span>
              )
            })}
          </div>

          {/* ============================================
              FEATURE HIGHLIGHTS
              ============================================ */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
              <FaDownload className="text-blue-500 w-4 h-4" />
              <span>Up to 8K</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
              <FaMusic className="text-purple-500 w-4 h-4" />
              <span>320kbps Audio</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
              <FaImage className="text-pink-500 w-4 h-4" />
              <span>HD Thumbnails</span>
            </div>
          </div>

          {/* ============================================
              FOOTER HINT
          ============================================ */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300
            [text-shadow:_0_2px_15px_rgba(0,0,0,0.1)]">
            <span className="text-lg">💡</span>
            <span>Paste a URL to auto-convert instantly</span>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          </div>
        </div>
      </div>

      {/* ============================================
          SCROLL INDICATOR
          ============================================ */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="flex flex-col items-center gap-1.5 animate-bounce opacity-70 hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
            Scroll
          </span>
          <div className="w-5 h-8 rounded-full border-2 border-gray-400/40 dark:border-gray-500/40 flex justify-center backdrop-blur-sm bg-white/10 dark:bg-gray-800/10">
            <div className="w-1.5 h-2.5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mt-1.5 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* ============================================
          CSS ANIMATIONS
          ============================================ */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
<<<<<<< HEAD
            transform: translateY(-15px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
=======
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
>>>>>>> 808d9f662b4d984e08923e6b29b1d90dbc84b397
          }
        }

        @keyframes shrink-width {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-fadeIn {
<<<<<<< HEAD
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
=======
          animation: fadeIn 0.3s ease-out forwards;
>>>>>>> 808d9f662b4d984e08923e6b29b1d90dbc84b397
        }

        .animate-shrink-width {
          animation: shrink-width 5s linear forwards;
        }
      `}</style>
    </section>
  )
}