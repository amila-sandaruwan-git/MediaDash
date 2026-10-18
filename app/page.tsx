// app/page.tsx

'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
//import { Analytics } from '@vercel/analytics/react'

import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import ResultSection from './components/ResultSection'
import AboutSection from './components/AboutSection'
import HelpSection from './components/HelpSection'
import InstallSection from './components/InstallSection'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import { MediaInfo } from './types'
import axios from 'axios'

export default function Home() {
  const [mediaInfo, setMediaInfo] = useState<MediaInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<{ message: string; suggestion?: string } | null>(null)
  const [isDesktopApp, setIsDesktopApp] = useState(false)
  
  // Use refs to track ongoing requests
  const abortControllerRef = useRef<AbortController | null>(null)
  const currentRequestIdRef = useRef<number>(0)

  // Check if running in Electron Desktop App
  useEffect(() => {
    if (typeof window !== 'undefined' && window.navigator.userAgent.includes('Electron')) {
      setIsDesktopApp(true)
    }
  }, [])

  // ============================================
  // OPTIMIZED onConvert FUNCTION
  // ============================================
  const handleConvert = useCallback(async (url: string) => {
    const trimmedUrl = url.trim()
    if (!trimmedUrl) return

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }

    currentRequestIdRef.current += 1
    const requestId = currentRequestIdRef.current

    setIsLoading(true)
    setError(null)
    setMediaInfo(null)

    try {
      const controller = new AbortController()
      abortControllerRef.current = controller

      console.log(`[Request ${requestId}] Starting conversion for: ${trimmedUrl}`)

      const response = await axios.post(
        'http://localhost:3001/api/convert',
        { url: trimmedUrl },
        {
          signal: controller.signal,
          timeout: 60000, 
        }
      )

      if (requestId !== currentRequestIdRef.current) {
        console.log(`[Request ${requestId}] Cancelled - newer request exists`)
        return
      }

      if (response.data.success) {
        setMediaInfo(response.data.data)
        setTimeout(() => {
          document.getElementById('results')?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          })
        }, 100)
      } else {
        setError({
          message: response.data.message || response.data.error || 'Failed to process the URL',
          suggestion: response.data.suggestion
        })
      }
    } catch (err: any) {
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
        return
      }
      if (requestId !== currentRequestIdRef.current) return

      console.error(`[Request ${requestId}] Error:`, err)
      
      // 👇 THIS IS THE FIX: It pulls the exact error from yt-dlp (err.response.data.error)
      const errorData = err.response?.data
      setError({
        message: errorData?.error || errorData?.message || 'An error occurred while processing your request.',
        suggestion: errorData?.suggestion || 'Check the app console for more details.'
      })
    } finally {
      if (requestId === currentRequestIdRef.current) {
        setIsLoading(false)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current = null
      }
    }
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar isDesktopApp={isDesktopApp} />
      
      <div className="pt-16">
        <HeroSection 
          onConvert={handleConvert} 
          isLoading={isLoading}
          error={error}
          isDesktopApp={isDesktopApp}
        />
        
        {mediaInfo && <ResultSection mediaInfo={mediaInfo} />}
        
        <AboutSection />
        <HelpSection />
        
        {/* 👇 Only show Install section if NOT in the desktop app */}
        {!isDesktopApp && <InstallSection />}
        
        <Footer />
        <ScrollToTop />
        
      </div>
    </main>
  )
}