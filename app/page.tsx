//app/page.tsx

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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConvert = async (url: string) => {
    setIsLoading(true)
    setError(null)
    setMediaInfo(null)

    try {
      const response = await axios.post('/api/convert', { url })
      
      if (response.data.success) {
        setMediaInfo(response.data.data)
        setTimeout(() => {
          document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
        }, 200)
      } else {
        setError(response.data.message || 'Failed to process the URL')
      }
    } catch (err) {
      setError('An error occurred while processing your request. Please try again.')
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
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          </div>
        )}
        
        {mediaInfo && <ResultSection mediaInfo={mediaInfo} />}
        
        <AboutSection />
        <HelpSection />
        <InstallSection />
        <Footer />
      </div>
    </main>
  )
}
