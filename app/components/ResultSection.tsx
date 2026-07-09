// app/components/ResultSection.tsx

'use client'

import { MediaInfo, VideoFormat, AudioFormat } from '@/app/types'
import { FaDownload, FaVideo, FaMusic, FaImage } from 'react-icons/fa'
import { useState } from 'react'

interface ResultSectionProps {
  mediaInfo: MediaInfo | null
}

export default function ResultSection({ mediaInfo }: ResultSectionProps) {
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'thumbnail'>('video')

  if (!mediaInfo) return null

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return 'Unknown'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const downloadFile = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <section id="results" className="py-12 px-4 max-w-6xl mx-auto animate-fadeIn">
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
              {mediaInfo.video_formats.map((format: VideoFormat) => (
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
                    onClick={() => downloadFile(format.url, `${mediaInfo.title}_${format.resolution}.${format.ext}`)}
                    className="w-full mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <FaDownload />
                    Download
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'audio' && mediaInfo.audio_formats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mediaInfo.audio_formats.map((format: AudioFormat) => (
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
                    onClick={() => downloadFile(format.url, `${mediaInfo.title}_${format.bitrate}.${format.ext}`)}
                    className="w-full mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <FaDownload />
                    Download
                  </button>
                </div>
              ))}
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
                onClick={() => downloadFile(mediaInfo.thumbnail, `${mediaInfo.title}_thumbnail.jpg`)}
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