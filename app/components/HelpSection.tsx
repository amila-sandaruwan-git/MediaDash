//app/components/HelpSection.tsx

'use client'

import { FaVideo, FaMusic, FaImage, FaLink, FaDownload } from 'react-icons/fa'

const steps = [
  {
    icon: FaLink,
    title: 'Copy the URL',
    description: 'Copy the video or audio URL from your favorite platform'
  },
  {
    icon: FaDownload,
    title: 'Paste & Convert',
    description: 'Paste the URL in the input box and click "CONVERTER"'
  },
  {
    icon: FaVideo,
    title: 'Choose Quality',
    description: 'Select from available video resolutions (360p to 8K)'
  },
  {
    icon: FaMusic,
    title: 'Download Audio',
    description: 'Extract audio in MP3 format with bitrates up to 320kbps'
  },
  {
    icon: FaImage,
    title: 'Save Thumbnail',
    description: 'Download the video thumbnail in high resolution'
  }
]

export default function HelpSection() {
  return (
    <section id="help" className="py-16 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">How to Use MediaDash</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Download videos, audio, and thumbnails in 3 simple steps
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow relative">
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              {index + 1}
            </div>
            <step.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4 mt-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">💡 Tips for Best Results</h3>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
          <li>Make sure the URL is publicly accessible</li>
          <li>For highest quality, choose 4K or 8K if available</li>
          <li>Download audio in 320kbps for the best sound quality</li>
          <li>Thumbnails are automatically extracted in high resolution</li>
        </ul>
      </div>
    </section>
  )
}