// app/components/InstallSection.tsx

'use client'

import { FaWindows, FaApple, FaLinux, FaDownload } from 'react-icons/fa'

const platforms = [
  {
    name: 'Windows',
    icon: FaWindows,
    color: 'text-blue-600',
    downloadUrl: '#',
    version: 'v1.0.0'
  },
  {
    name: 'macOS',
    icon: FaApple,
    color: 'text-gray-700 dark:text-gray-300',
    downloadUrl: '#',
    version: 'v1.0.0'
  },
  {
    name: 'Linux',
    icon: FaLinux,
    color: 'text-orange-600',
    downloadUrl: '#',
    version: 'v1.0.0'
  }
]

export default function InstallSection() {
  return (
    <section id="install" className="py-16 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Install MediaDash Desktop App</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Download the desktop version for a faster, offline experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {platforms.map((platform) => (
          <div key={platform.name} className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
            <platform.icon className={`w-16 h-16 mx-auto mb-4 ${platform.color}`} />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{platform.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Version {platform.version}</p>
            <a
              href={platform.downloadUrl}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <FaDownload />
              Download
            </a>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          The desktop app offers faster downloads, batch processing, and offline access to your downloaded content.
        </p>
      </div>
    </section>
  )
}