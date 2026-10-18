// app/components/HeroSection.tsx

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { FaSpinner, FaTimes, FaDownload, FaMusic, FaImage, FaYoutube, FaFacebook, FaInstagram, FaTiktok, FaTwitter, FaReddit, FaLinkedin, FaDesktop, FaLink, FaArrowRight } from 'react-icons/fa'

interface HeroSectionProps {
  onConvert: (url: string) => void
  isLoading: boolean
  error?: { message: string; suggestion?: string } | null
  isDesktopApp?: boolean;
}

export default function HeroSection({ onConvert, isLoading, error }: HeroSectionProps) {
  const [url, setUrl] = useState('')
  const [isPasted, setIsPasted] = useState(false)
  const [displayError, setDisplayError] = useState<{ message: string; suggestion?: string } | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [showWebWarning, setShowWebWarning] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastConvertedUrlRef = useRef<string>('')
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const isConvertingRef = useRef(false)

  // ============================================
  // HANDLE ERROR WITH AUTO-CLOSE
  // ============================================
  useEffect(() => {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current)
      errorTimeoutRef.current = null
    }

    if (error) {
      setDisplayError(error)
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
  // CLOSE WEB WARNING
  // ============================================
  const closeWebWarning = useCallback(() => {
    setShowWebWarning(false)
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

  const scrollToInstall = () => {
    const installSection = document.getElementById('install')
    if (installSection) {
      installSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="md-hero">
      {/* Decorative background (pure CSS, no image) */}
      <div className="md-hero__bg" aria-hidden="true">
        <span className="md-hero__glow md-hero__glow--a" />
        <span className="md-hero__glow md-hero__glow--b" />
      </div>

      <div className="md-hero__inner">
        {/* Web converter warning */}
        {showWebWarning && (
          <div className="md-alert md-alert--warn animate-fadeIn">
            <button onClick={closeWebWarning} className="md-alert__close" aria-label="Dismiss">
              <FaTimes />
            </button>
            <div className="md-alert__body">
              <span className="md-alert__emoji">⚠️</span>
              <div>
                <h4 className="md-alert__title">Web Converter is Disabled</h4>
                <p className="md-alert__text">
                  The web version cannot process downloads because <code>yt-dlp</code> is not available on this server.
                </p>
                <div className="md-alert__actions">
                  <button onClick={scrollToInstall} className="md-btn md-btn--small">
                    <FaDesktop /> Download Desktop App
                  </button>
                  
                </div>
              </div>
            </div>
            <div className="md-alert__bar">
              <div className="md-alert__bar-fill animate-shrink-width" style={{ animationDuration: '8s', animationFillMode: 'forwards' }} />
            </div>
          </div>
        )}

        {/* Error message */}
        {displayError && (
          <div className="md-alert md-alert--error animate-fadeIn">
            <button onClick={closeError} className="md-alert__close" aria-label="Dismiss">
              <FaTimes />
            </button>
            <div className="md-alert__body">
              <span className="md-alert__emoji">⚠️</span>
              <div>
                <p className="md-alert__text md-alert__text--strong">{displayError.message}</p>
                {displayError.suggestion && <p className="md-alert__hint">💡 {displayError.suggestion}</p>}
              </div>
            </div>
            <div className="md-alert__bar">
              <div className="md-alert__bar-fill animate-shrink-width" style={{ animationDuration: '5s', animationFillMode: 'forwards' }} />
            </div>
          </div>
        )}

        <div className="md-hero__content">
          <span className="md-hero__eyebrow">
            <span className="md-hero__dot" />
            Free • No sign-up • 1000+ sites
          </span>

          <h1 className="md-hero__title">
            Download videos, audio
            <br />
            <span className="md-hero__title-grad">&amp; thumbnails</span> in one paste.
          </h1>

          <p className="md-hero__sub">
            Drop in a link from YouTube, Instagram, TikTok, Facebook and more. Pick your quality, up to 8K video or 320kbps audio.
          </p>

          {/* Command bar */}
          <form onSubmit={handleSubmit} className={`md-hero__form ${isFocused ? 'is-focused' : ''}`}>
            <FaLink className="md-hero__form-icon" aria-hidden="true" />
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
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="md-hero__input"
              aria-label="Video or audio URL"
            />
            {isPasted && !isLoading && url.trim() && <span className="md-hero__pasted">✓ Pasted</span>}
            <button type="submit" disabled={isLoading || !url.trim()} className="md-btn md-hero__submit">
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <span>Convert</span>
                  <FaArrowRight />
                </>
              )}
            </button>
          </form>

          <p className="md-hero__hint">
            <span className="md-hero__dot" /> Paste a URL to auto-convert instantly
          </p>

          {/* Platforms */}
          <div className="md-hero__platforms">
            {['YouTube', 'Facebook', 'Instagram', 'TikTok', 'X', 'Reddit', 'LinkedIn'].map((site) => {
              const Icon = platformIcons[site]
              return (
                <span key={site} className="md-chip">
                  {Icon && <Icon />}
                  {site}
                </span>
              )
            })}
            <span className="md-chip md-chip--more">+1000 more</span>
          </div>

          {/* Stats */}
          <div className="md-hero__stats">
            <div className="md-stat"><FaDownload /><strong>8K</strong><span>Max video quality</span></div>
            <div className="md-stat"><FaMusic /><strong>320kbps</strong><span>MP3 audio</span></div>
            <div className="md-stat"><FaImage /><strong>HD</strong><span>Thumbnails</span></div>
          </div>

          <button onClick={scrollToInstall} className="md-hero__cta">
            <FaDesktop /> Get the Desktop App
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-15px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shrink-width {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-shrink-width { animation: shrink-width 5s linear forwards; }
      `}</style>
    </section>
  )
}