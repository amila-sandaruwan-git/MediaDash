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
      

      

      
    </section>
  )
}