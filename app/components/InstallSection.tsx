// app/components/InstallSection.tsx

'use client'

import { FaWindows, FaDownload, FaDesktop } from 'react-icons/fa'

const platforms = [
  {
    name: 'Windows',
    icon: FaWindows,
    color: 'text-blue-600',
    // Direct Google Drive download link
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1HfYsoq1hyXaaRrnKkJ23pA8GYdwkcRkq', 
    version: 'v1.0.0'
  }
]

export default function InstallSection() {
  return (
    <section id="install" className="py-16 px-4 max-w-6xl mx-auto scroll-mt-20">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <FaDesktop className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
            Install MediaDash Desktop App
          </h2>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          ⚡ <strong>FULLY WORKING VERSION</strong> — Download videos, audio &amp; thumbnails without limitations.
          <br />
          
        </p>
      </div>

      {/* 👇 Changed to flexbox to easily center the single card */}
      <div className="flex justify-center">
        {platforms.map((platform) => (
          <div 
            key={platform.name} 
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow border-2 border-amber-200 dark:border-amber-800/50"
          >
            <platform.icon className={`w-20 h-20 mx-auto mb-4 ${platform.color}`} />
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{platform.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Version {platform.version}</p>
            <a
              href={platform.downloadUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
            >
              <FaDownload />
              Download for Windows
            </a>
          </div>
        ))}
      </div>

      <div className="mt-12 max-w-3xl mx-auto bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl p-6 text-center border border-amber-200 dark:border-amber-800/50">
        <p className="text-gray-600 dark:text-gray-400">
          🚀 The desktop app includes full <code className="bg-amber-100 dark:bg-amber-800/30 px-2 py-0.5 rounded text-sm font-mono">yt-dlp</code> support for downloading videos, audio, and thumbnails from 1000+ platforms.
        </p>
      </div>
    </section>
  )
}