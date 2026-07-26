// app/components/InstallSection.tsx

'use client'

import { FaWindows } from 'react-icons/fa'

export default function InstallSection() {
  return (
    <section id="install" className="py-16 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Download MediaDash for Windows
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Get the desktop app for the best experience.
        </p>
      </div>

      <div className="flex justify-center">
        <a
          href="https://drive.google.com/uc?export=download&id=1HXIZaWUNToQfvqY8HjPgrapT_CV0PMfU"
          download
          className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <FaWindows className="w-6 h-6" />
          Download for Windows
        </a>
      </div>
      <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Version 1.0.0 • Setup Installer (EXE) • 74MB
      </p>
    </section>
  )
}