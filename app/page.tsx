'use client'

import { useState } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import ResultSection from './components/ResultSection'
import AboutSection from './components/AboutSection'
import HelpSection from './components/HelpSection'
import InstallSection from './components/InstallSection'
import Footer from './components/Footer'
import { MediaInfo } from './types'
import axios from 'axios'

export default function Home() {
  const [mediaInfo, setMediaInfo] = useState<MediaInfo | null>(null)
  const [cacheInfo, setCacheInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<{ message: string; suggestion?: string } | null>(null)

  const handleConvert = async (url: string) => {
    setIsLoading(true)
    setError(null)
    setMediaInfo(null)
    setCacheInfo(null)

    try {
      const response = await axios.post('/api/convert', { url })
      
      if (response.data.success) {
        setMediaInfo(response.data.data)
        setCacheInfo(response.data.cacheInfo || null)
        setTimeout(() => {
          document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
        }, 200)
      } else {
        setError({
          message: response.data.message || 'Failed to process the URL',
          suggestion: response.data.suggestion
        })
      }
    } catch (err: any) {
      const errorData = err.response?.data
      setError({
        message: errorData?.message || 'An error occurred while processing your request.',
        suggestion: errorData?.suggestion
      })
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="pt-16">
        <HeroSection onConvert={handleConvert} isLoading={isLoading} />
        
        {error && (
          <div className="max-w-3xl mx-auto px-4 -mt-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-400">{error.message}</p>
              {error.suggestion && (
                <p className="text-sm text-red-600 dark:text-red-300 mt-2">
                  💡 {error.suggestion}
                </p>
              )}
            </div>
          </div>
        )}
        
        {mediaInfo && <ResultSection mediaInfo={mediaInfo} cacheInfo={cacheInfo} />}
        
        <AboutSection />
        <HelpSection />
        <InstallSection />
        <Footer />
      </div>
    </main>
  )
}