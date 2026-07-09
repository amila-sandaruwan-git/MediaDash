'use client'

import { MediaInfo, VideoFormat, AudioFormat } from '../types'
import { FaDownload, FaVideo, FaMusic, FaImage, FaSpinner, FaClock, FaCheck } from 'react-icons/fa'
import { useState } from 'react'

interface ResultSectionProps {
  mediaInfo: MediaInfo | null
  cacheInfo?: {
    cachedFormats: string[]
    cacheSize: number
    isAudioCached: boolean
  }
}

export default function ResultSection({ mediaInfo, cacheInfo }: ResultSectionProps) {
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'thumbnail'>('video')
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [buttonStatus, setButtonStatus] = useState<Record<string, string>>({})
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [downloadError, setDownloadError] = useState<string | null>(null)

  if (!mediaInfo) return null

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return 'Unknown'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDownload = async (url: string, quality: string, type: 'video' | 'audio', buttonId: string) => {
    try {
      setDownloadingId(buttonId)
      setButtonStatus(prev => ({ ...prev, [buttonId]: 'Checking cache...' }))
      setProgress(prev => ({ ...prev, [buttonId]: 0 }))
      setDownloadError(null)

      // Simulate progress during cache check (0-30%)
      let progressInterval = setInterval(() => {
        setProgress(prev => {
          const current = prev[buttonId] || 0
          if (current < 30) {
            return { ...prev, [buttonId]: current + Math.random() * 2 + 1 }
          }
          return prev
        })
      }, 100)

      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: mediaInfo.webpage_url,
          action: 'download',
          formatId: quality === 'audio' ? 'bestaudio' : quality,
          quality: type === 'audio' ? 'audio' : quality,
        }),
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Download failed')
      }

      // Check if it's a cached response
      const cacheStatus = response.headers.get('X-Cache-Status')
      if (cacheStatus === 'HIT') {
        setProgress(prev => ({ ...prev, [buttonId]: 100 }))
        setButtonStatus(prev => ({ ...prev, [buttonId]: 'Complete! ⚡' }))
        
        const blob = await response.blob()
        const filename = `${mediaInfo.title || 'video'}_${quality}.${type === 'video' ? 'mp4' : 'mp3'}`
        
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(link.href)

        setTimeout(() => {
          setButtonStatus(prev => {
            const newStatus = { ...prev }
            delete newStatus[buttonId]
            return newStatus
          })
          setProgress(prev => {
            const newProgress = { ...prev }
            delete newProgress[buttonId]
            return newProgress
          })
          setDownloadingId(null)
        }, 2500)
        return
      }

      // --- REAL DOWNLOAD PROGRESS ---
      setButtonStatus(prev => ({ ...prev, [buttonId]: 'Downloading...' }))
      
      const contentLength = parseInt(response.headers.get('Content-Length') || '0')

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Failed to read response stream')
      }

      const chunks: Uint8Array[] = []
      let receivedLength = 0
      
      // Continue progress from where it left off (30%)
      setProgress(prev => ({ ...prev, [buttonId]: 30 }))

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          break
        }

        receivedLength += value.length
        chunks.push(value)

        // Calculate progress percentage (30-100%)
        let percent = 30
        if (contentLength > 0) {
          percent = 30 + ((receivedLength / contentLength) * 70)
          percent = Math.min(99, percent)
        } else {
          const chunkProgress = 30 + (chunks.length * 1.5)
          percent = Math.min(99, chunkProgress)
        }
        
        setProgress(prev => ({ ...prev, [buttonId]: percent }))
      }

      // Download complete
      setProgress(prev => ({ ...prev, [buttonId]: 100 }))
      setButtonStatus(prev => ({ ...prev, [buttonId]: 'Complete! 🎉' }))
      
      const blob = new Blob(chunks as BlobPart[])
      
      const filename = `${mediaInfo.title || 'video'}_${quality}.${type === 'video' ? 'mp4' : 'mp3'}`
      
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)

      setTimeout(() => {
        setButtonStatus(prev => {
          const newStatus = { ...prev }
          delete newStatus[buttonId]
          return newStatus
        })
        setProgress(prev => {
          const newProgress = { ...prev }
          delete newProgress[buttonId]
          return newProgress
        })
        setDownloadingId(null)
      }, 3000)

    } catch (error: any) {
      console.error('Download failed:', error)
      setButtonStatus(prev => ({ ...prev, [buttonId]: 'Failed! ❌' }))
      setProgress(prev => ({ ...prev, [buttonId]: 0 }))
      setDownloadError(error.message || 'Download failed. Please try again.')
      setTimeout(() => {
        setButtonStatus(prev => {
          const newStatus = { ...prev }
          delete newStatus[buttonId]
          return newStatus
        })
        setProgress(prev => {
          const newProgress = { ...prev }
          delete newProgress[buttonId]
          return newProgress
        })
        setDownloadingId(null)
      }, 3000)
    }
  }

  const isFormatCached = (quality: string): boolean => {
    if (!cacheInfo) return false
    return cacheInfo.cachedFormats.includes(quality)
  }

  // Render button content
  const renderButtonContent = (buttonId: string, isCached: boolean, defaultText: string) => {
    const status = buttonStatus[buttonId]
    
    if (status) {
      if (status.includes('Checking')) {
        return (
          <div className="flex items-center justify-center gap-2 w-full relative z-10">
            <FaSpinner className="animate-spin flex-shrink-0" />
            <span className="text-xs md:text-sm truncate max-w-[180px]">
              {status}
            </span>
          </div>
        )
      }
      
      if (status.includes('Downloading')) {
        return (
          <div className="flex items-center justify-center gap-2 w-full relative z-10">
            <FaSpinner className="animate-spin flex-shrink-0" />
            <span className="text-xs md:text-sm truncate max-w-[200px]">
              {status}
            </span>
          </div>
        )
      }
      
      if (status.includes('Complete')) {
        return (
          <div className="flex items-center justify-center gap-2 w-full relative z-10">
            <FaCheck className="flex-shrink-0" />
            <span>{status}</span>
          </div>
        )
      }
      
      if (status.includes('Failed')) {
        return (
          <div className="flex items-center justify-center gap-2 w-full relative z-10">
            <span>❌</span>
            <span>{status}</span>
          </div>
        )
      }
      
      return <span>{status}</span>
    }
    
    return (
      <div className="flex items-center justify-center gap-2 w-full">
        <FaDownload className="flex-shrink-0" />
        {defaultText}
      </div>
    )
  }

  // Get button color based on status
  const getButtonColor = (buttonId: string, isCached: boolean, type: 'video' | 'audio') => {
    const status = buttonStatus[buttonId]
    
    if (status) {
      if (status.includes('Checking')) return 'bg-blue-600 hover:bg-blue-700'
      if (status.includes('Downloading')) return 'bg-orange-600 hover:bg-orange-700'
      if (status.includes('Complete')) return 'bg-green-600 hover:bg-green-700'
      if (status.includes('Failed')) return 'bg-red-600 hover:bg-red-700'
    }
    
    if (isCached) return 'bg-green-600 hover:bg-green-700'
    return type === 'video' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'
  }

  return (
    <section id="results" className="py-12 px-4 max-w-6xl mx-auto animate-fadeIn">
      {downloadError && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          {downloadError}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Video Info Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={mediaInfo.thumbnail} 
              alt={mediaInfo.title}
              className="w-24 h-16 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {mediaInfo.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Duration: {Math.floor(mediaInfo.duration / 60)}:{(mediaInfo.duration % 60).toString().padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'video'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <FaVideo className="inline mr-2" />
            Video ({mediaInfo.video_formats.length})
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'audio'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <FaMusic className="inline mr-2" />
            Audio ({mediaInfo.audio_formats.length})
          </button>
          <button
            onClick={() => setActiveTab('thumbnail')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'thumbnail'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <FaImage className="inline mr-2" />
            Thumbnail
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'video' && mediaInfo.video_formats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mediaInfo.video_formats.map((format: VideoFormat) => {
                const resolutionMatch = format.resolution.match(/(\d+)/)
                const qualityNumber = resolutionMatch ? parseInt(resolutionMatch[0]) : 720
                const fileSize = format.filesize > 0 ? formatFileSize(format.filesize) : 'Size unknown'
                const isCached = isFormatCached(format.resolution)
                const buttonId = `video_${format.format_id}`
                const isDownloading = downloadingId === buttonId
                const currentStatus = buttonStatus[buttonId]
                const progressValue = progress[buttonId] || 0
                
                const showCachedBadge = isCached && !currentStatus
                
                return (
                  <div key={format.format_id} className={`bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:shadow-md transition-shadow ${
                    showCachedBadge ? 'border-2 border-green-400 dark:border-green-600' : ''
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          {format.resolution}
                          {showCachedBadge && (
                            <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                              ⚡ Cached
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{format.quality}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {format.ext.toUpperCase()} • {fileSize}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <FaClock />
                        <span>{isCached ? 'Instant' : fileSize.includes('GB') ? '~2-5 min' : fileSize.includes('MB') ? '~5-30 sec' : '~2-5 sec'}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(mediaInfo.webpage_url, qualityNumber.toString(), 'video', buttonId)}
                      disabled={isDownloading}
                      className={`w-full mt-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 text-white ${getButtonColor(buttonId, isCached, 'video')} disabled:opacity-90 min-h-[44px] relative overflow-hidden`}
                    >
                      {/* White Light Loading Effect - Fills during Checking cache AND Downloading */}
                      {isDownloading && (
                        <>
                          <div 
                            className="absolute inset-0 bg-white/35 dark:bg-white/25 transition-all duration-300 rounded-lg"
                            style={{ 
                              width: `${Math.min(progressValue, 99)}%`,
                            }}
                          />
                          <div 
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) ${Math.min(progressValue, 99)}%, transparent 100%)`,
                            }}
                          />
                        </>
                      )}
                      {/* Content Layer */}
                      {renderButtonContent(buttonId, isCached, isCached ? 'Download (Cached)' : 'Download')}
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === 'audio' && mediaInfo.audio_formats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mediaInfo.audio_formats.map((format: AudioFormat) => {
                const fileSize = format.filesize > 0 ? formatFileSize(format.filesize) : 'Size unknown'
                const isCached = cacheInfo?.isAudioCached || false
                const buttonId = `audio_${format.format_id}`
                const isDownloading = downloadingId === buttonId
                const currentStatus = buttonStatus[buttonId]
                const progressValue = progress[buttonId] || 0
                const showCachedBadge = isCached && !currentStatus
                
                return (
                  <div key={format.format_id} className={`bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:shadow-md transition-shadow ${
                    showCachedBadge ? 'border-2 border-green-400 dark:border-green-600' : ''
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          {format.bitrate}
                          {showCachedBadge && (
                            <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                              ⚡ Cached
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {format.ext.toUpperCase()} • {fileSize}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {isCached ? 'Instant' : fileSize.includes('MB') ? '5-15 sec' : '2-5 sec'}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(mediaInfo.webpage_url, 'audio', 'audio', buttonId)}
                      disabled={isDownloading}
                      className={`w-full mt-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 text-white ${getButtonColor(buttonId, isCached, 'audio')} disabled:opacity-90 min-h-[44px] relative overflow-hidden`}
                    >
                      {/* White Light Loading Effect - Fills during Checking cache AND Downloading */}
                      {isDownloading && (
                        <>
                          <div 
                            className="absolute inset-0 bg-white/35 dark:bg-white/25 transition-all duration-300 rounded-lg"
                            style={{ 
                              width: `${Math.min(progressValue, 99)}%`,
                            }}
                          />
                          <div 
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) ${Math.min(progressValue, 99)}%, transparent 100%)`,
                            }}
                          />
                        </>
                      )}
                      {/* Content Layer */}
                      {renderButtonContent(buttonId, isCached, isCached ? 'Download MP3 (Cached)' : 'Download MP3')}
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === 'thumbnail' && (
            <div className="text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={mediaInfo.thumbnail} 
                alt={mediaInfo.title}
                className="max-w-md mx-auto rounded-lg shadow-lg mb-4"
              />
              <button
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = mediaInfo.thumbnail
                  link.download = `${mediaInfo.title}_thumbnail.jpg`
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                }}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                <FaDownload className="mr-2" />
                Download Thumbnail
              </button>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Thumbnail downloads instantly
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}