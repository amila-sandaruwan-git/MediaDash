'use client'

import { useState, useRef, useCallback } from 'react'
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
  
  // 🔥 Use refs to track ongoing requests
  const abortControllerRef = useRef<AbortController | null>(null)
  const currentRequestIdRef = useRef<number>(0)

  // ============================================
  // OPTIMIZED onConvert FUNCTION
  // ============================================
  const handleConvert = useCallback(async (url: string) => {
    // Trim the URL
    const trimmedUrl = url.trim()
    if (!trimmedUrl) return

    // 🔥 Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }

    // 🔥 Increment request ID to track the latest request
    currentRequestIdRef.current += 1
    const requestId = currentRequestIdRef.current

    // Set loading state immediately (UI updates instantly)
    setIsLoading(true)
    setError(null)
    setMediaInfo(null)

    try {
      // 🔥 Create new AbortController for this request
      const controller = new AbortController()
      abortControllerRef.current = controller

      console.log(`[Request ${requestId}] Starting conversion for: ${trimmedUrl}`)

      // 🔥 Use axios with AbortSignal
      const response = await axios.post(
        '/api/convert',
        { url: trimmedUrl },
        {
          signal: controller.signal,
          timeout: 60000, // 60 second timeout
        }
      )

      // 🔥 Check if this is still the latest request
      if (requestId !== currentRequestIdRef.current) {
        console.log(`[Request ${requestId}] Cancelled - newer request exists`)
        return
      }

      console.log(`[Request ${requestId}] Response received`)

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
          message: response.data.message || 'Failed to process the URL',
          suggestion: response.data.suggestion
        })
      }
    } catch (err: any) {
      // 🔥 Ignore abort errors (they're expected)
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
        console.log(`[Request ${requestId}] Cancelled by user`)
        return
      }

      // 🔥 Check if this is still the latest request
      if (requestId !== currentRequestIdRef.current) {
        return
      }

      console.error(`[Request ${requestId}] Error:`, err)
      
      const errorData = err.response?.data
      setError({
        message: errorData?.message || 'An error occurred while processing your request.',
        suggestion: errorData?.suggestion
      })
    } finally {
      // 🔥 Only clear loading if this is the latest request
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
      <Navbar />
      
      <div className="pt-16">
        {/* ============================================
            PASS ERROR TO HERO SECTION
            ============================================ */}
        <HeroSection 
          onConvert={handleConvert} 
          isLoading={isLoading}
          error={error}  // 👈 PASS ERROR HERE
        />
        
        {mediaInfo && <ResultSection mediaInfo={mediaInfo} />}
        
        <AboutSection />
        <HelpSection />
        <InstallSection />
        <Footer />
        <ScrollToTop />
      </div>
    </main>
  )
}