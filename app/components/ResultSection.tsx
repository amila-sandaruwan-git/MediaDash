'use client'

import { MediaInfo, VideoFormat, AudioFormat } from '../types'
import { FaDownload, FaVideo, FaMusic, FaImage, FaSpinner } from 'react-icons/fa'
import { useState } from 'react'

interface ResultSectionProps {
  mediaInfo: MediaInfo | null
}

export default function ResultSection({ mediaInfo }: ResultSectionProps) {
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'thumbnail'>('video')
  const [downloading, setDownloading] = useState<string | null>(null)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  if (!mediaInfo) return null

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return 'Unknown'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDownload = async (url: string, quality: string, type: 'video' | 'audio') => {
    try {
      setDownloading(quality)
      setDownloadError(null)

      // Extract video ID from URL for filename
      const videoId = url.split('v=')[1]?.split('&')[0] || Date.now().toString()
      const filename = `${mediaInfo.title || 'video'}_${quality}.${type === 'video' ? 'mp4' : 'mp3'}`
      
      // Call the download API
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

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Download failed')
      }

      // Get the blob from response
      const blob = await response.blob()
      
      // Create download link
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)

    } catch (error: any) {
      console.error('Download failed:', error)
      setDownloadError(error.message || 'Download failed. Please try again.')
    } finally {
      setDownloading(null)
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
            Video
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
            Audio
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
                // Extract resolution number for quality selection
                const resolutionMatch = format.resolution.match(/(\d+)/)
                const qualityNumber = resolutionMatch ? parseInt(resolutionMatch[0]) : 720
                const isDownloading = downloading === format.resolution
                
                return (
                  <div key={format.format_id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{format.resolution}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{format.quality}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">{format.ext.toUpperCase()}</div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {format.filesize > 0 ? formatFileSize(format.filesize) : 'Size unknown'}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(mediaInfo.webpage_url, qualityNumber.toString(), 'video')}
                      disabled={isDownloading}
                      className="w-full mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
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
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === 'audio' && mediaInfo.audio_formats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mediaInfo.audio_formats.map((format: AudioFormat) => {
                const isDownloading = downloading === format.bitrate
                
                return (
                  <div key={format.format_id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{format.bitrate}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">{format.ext.toUpperCase()}</div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {format.filesize > 0 ? formatFileSize(format.filesize) : 'Size unknown'}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(mediaInfo.webpage_url, 'audio', 'audio')}
                      disabled={isDownloading}
                      className="w-full mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
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
                <FaDownload />
                Download Thumbnail
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}