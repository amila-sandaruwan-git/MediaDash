'use client'

import { MediaInfo, VideoFormat, AudioFormat } from '../types'
import { FaDownload, FaVideo, FaMusic, FaImage, FaSpinner } from 'react-icons/fa'
import { useState } from 'react'

interface ResultSectionProps {
  mediaInfo: MediaInfo | null
}

export default function ResultSection({ mediaInfo }: ResultSectionProps) {
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'thumbnail'>('video')
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  if (!mediaInfo) return null

  // ============================================
  // VIDEO RESOLUTION CONFIGURATION - FOR LABELS ONLY
  // ============================================
  const videoQualityConfigs: Record<string, { label: string; pixelSize: string; quality: string }> = {
    '144': { label: '144p', pixelSize: '256x144', quality: 'Low' },
    '240': { label: '240p', pixelSize: '426x240', quality: 'Low' },
    '360': { label: '360p', pixelSize: '640x360', quality: 'SD (Standard Definition)' },
    '480': { label: '480p', pixelSize: '640x480', quality: 'SD (Standard Definition)' },
    '720': { label: '720p', pixelSize: '1280x720', quality: 'HD (High Definition)' },
    '1080': { label: '1080p', pixelSize: '1920x1080', quality: 'Full HD (FHD)' },
    '1440': { label: '1440p', pixelSize: '2560x1440', quality: '2K (Quad HD)' },
    '2160': { label: '2160p', pixelSize: '3840x2160', quality: '4K or Ultra HD (UHD)' },
    '4320': { label: '4320p', pixelSize: '7680x4320', quality: '8K (Full Ultra HD)' },
  }

  // ============================================
  // AUDIO BITRATE CONFIGURATION
  // ============================================
  const audioQualityConfigs: Record<string, { label: string; quality: string }> = {
    '128': { label: '128 kbps', quality: 'Standard Quality' },
    '192': { label: '192 kbps', quality: 'Medium Quality' },
    '256': { label: '256 kbps', quality: 'High Quality' },
    '320': { label: '320 kbps', quality: 'Maximum MP3 Quality' },
  }

  // ============================================
  // FORMAT FILE SIZE
  // ============================================
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return 'Size unknown'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2))
    return `${size} ${sizes[i]}`
  }

  // ============================================
  // GET VIDEO QUALITY INFO - RETURNS LABEL OR FALLBACK
  // ============================================
  const getVideoQualityInfo = (resolution: string) => {
    const match = resolution.match(/(\d+)/)
    if (!match) return null
    const res = match[0]
    return videoQualityConfigs[res] || {
      label: resolution,
      pixelSize: '',
      quality: 'Available'
    }
  }

  // ============================================
  // GET AUDIO QUALITY INFO
  // ============================================
  const getAudioQualityInfo = (bitrate: string) => {
    const match = bitrate.match(/(\d+)/)
    if (!match) return null
    const rate = match[0]
    return audioQualityConfigs[rate] || null
  }

  // ============================================
  // DOWNLOAD HANDLER - SENDS ACTUAL FORMAT ID
  // ============================================
  const handleDownload = async (url: string, formatId: string, quality: string, type: 'video' | 'audio', buttonId: string) => {
    try {
      setDownloadingId(buttonId)
      setDownloadError(null)

      let qualityValue: string
      let formatIdValue: string
      
      if (type === 'audio') {
        qualityValue = `${quality}kbps`
        formatIdValue = 'bestaudio'
      } else {
        // For video, send the actual format ID (e.g., '137', '248', '399')
        qualityValue = quality
        formatIdValue = formatId // This is the actual yt-dlp format ID!
      }

      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: mediaInfo.webpage_url,
          action: 'download',
          formatId: formatIdValue,
          quality: qualityValue,
          type: type,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Download failed')
      }

      const blob = await response.blob()
      const filename = `${mediaInfo.title || 'video'}_${quality}.${type === 'video' ? 'mp4' : 'mp3'}`
      
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setTimeout(() => URL.revokeObjectURL(link.href), 100)

      setTimeout(() => {
        setDownloadingId(null)
      }, 600)

    } catch (error: any) {
      console.error('Download failed:', error)
      setDownloadError(error.message || 'Download failed. Please try again.')
      setDownloadingId(null)
    }
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
          {/* ============================================
              VIDEO SECTION - SHOW ALL FORMATS
              ============================================ */}
          {activeTab === 'video' && mediaInfo.video_formats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mediaInfo.video_formats.map((format: VideoFormat) => {
                // 🔥 FIX: Always show the format, even if not in our config
                const qualityInfo = getVideoQualityInfo(format.resolution)
                if (!format.url) return null
                
                const buttonId = `video_${format.format_id}`
                const isDownloading = downloadingId === buttonId
                const fileSize = format.filesize > 0 ? formatFileSize(format.filesize) : 'Size unknown'
                
                // Get the display label
                let displayLabel = qualityInfo?.label || format.resolution
                let displayQuality = qualityInfo?.quality || ''
                let displayPixelSize = qualityInfo?.pixelSize || ''
                
                return (
                  <div key={format.format_id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="mb-2">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {displayLabel}
                        {format.quality && format.quality !== 'Standard' && (
                          <span className="ml-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                            {format.quality}
                          </span>
                        )}
                      </div>
                      {displayQuality && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {displayQuality} {displayPixelSize && `• ${displayPixelSize}`}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {format.ext.toUpperCase()} • {fileSize}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(
                        mediaInfo.webpage_url,
                        format.format_id, // Send the actual format ID!
                        format.resolution,
                        'video',
                        buttonId
                      )}
                      disabled={isDownloading}
                      className={`w-full mt-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 text-white relative overflow-hidden ${
                        isDownloading 
                          ? 'bg-blue-400 cursor-wait' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isDownloading && (
                        <div 
                          className="absolute inset-0 bg-white/40 dark:bg-white/30 transition-all duration-300"
                          style={{ 
                            width: '100%',
                            animation: 'pulse-light 0.8s ease-in-out infinite'
                          }}
                        />
                      )}
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isDownloading ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            Downloading...
                          </>
                        ) : (
                          <>
                            <FaDownload />
                            Download
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === 'video' && mediaInfo.video_formats.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No video formats available for this URL.</p>
            </div>
          )}

          {/* ============================================
              AUDIO SECTION
              ============================================ */}
          {activeTab === 'audio' && mediaInfo.audio_formats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mediaInfo.audio_formats.map((format: AudioFormat) => {
                const qualityInfo = getAudioQualityInfo(format.bitrate)
                if (!format.url && !format.format_id.includes('audio_')) return null
                
                const buttonId = `audio_${format.format_id}`
                const isDownloading = downloadingId === buttonId
                const fileSize = format.filesize > 0 ? formatFileSize(format.filesize) : 'Size unknown'
                
                const bitrateMatch = format.bitrate.match(/(\d+)/)
                const bitrateValue = bitrateMatch ? bitrateMatch[0] : '128'
                
                return (
                  <div key={format.format_id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="mb-2">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {qualityInfo ? qualityInfo.label : format.bitrate}
                      </div>
                      {qualityInfo && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {qualityInfo.quality}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {format.ext.toUpperCase()} • {fileSize}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(mediaInfo.webpage_url, bitrateValue, bitrateValue, 'audio', buttonId)}
                      disabled={isDownloading}
                      className={`w-full mt-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 text-white relative overflow-hidden ${
                        isDownloading 
                          ? 'bg-purple-400 cursor-wait' 
                          : 'bg-purple-600 hover:bg-purple-700'
                      }`}
                    >
                      {isDownloading && (
                        <div 
                          className="absolute inset-0 bg-white/40 dark:bg-white/30 transition-all duration-300"
                          style={{ 
                            width: '100%',
                            animation: 'pulse-light 0.8s ease-in-out infinite'
                          }}
                        />
                      )}
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isDownloading ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            Downloading...
                          </>
                        ) : (
                          <>
                            <FaDownload />
                            Download MP3
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === 'audio' && mediaInfo.audio_formats.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No audio formats available for this URL.</p>
            </div>
          )}

          {/* ============================================
              THUMBNAIL SECTION
              ============================================ */}
          {activeTab === 'thumbnail' && mediaInfo.thumbnail && (
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

      <style jsx>{`
        @keyframes pulse-light {
          0% { opacity: 0.3; }
          50% { opacity: 0.7; }
          100% { opacity: 0.3; }
        }
      `}</style>
    </section>
  )
}