# 🎬 MediaDash - Universal Media Downloader

[![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.6-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

> Download videos, audio, and thumbnails from YouTube, Facebook, Instagram, TikTok, and 1000+ other platforms with one click!

![MediaDash Screenshot](https://via.placeholder.com/1200x630/0f172a/ffffff?text=MediaDash)

## ✨ Features

### 🎥 Video Download
- Support for **1000+ platforms** (YouTube, Facebook, Instagram, TikTok, Twitter/X, Reddit, LinkedIn, and more)
- Multiple resolutions: **360p, 480p, 720p, 1080p, 2K, 4K, 8K**
- MP4, WEBM, 3GP formats
- **Automatic merging** of video and audio streams

### 🎵 Audio Extraction
- Extract audio from any video
- Multiple bitrates: **128kbps, 192kbps, 256kbps, 320kbps**
- MP3 format with high-quality encoding

### 🖼️ Thumbnail Download
- Extract high-resolution thumbnails
- Instant download without processing

### ⚡ Smart Caching
- **Automatic caching** of downloaded content
- **Instant downloads** for cached videos
- **5GB cache limit** with auto-cleanup
- **24-hour cache expiration**
- Visual indicators for cached content (⚡ badge, green border)

### 🎨 User Experience
- **Dark/Light mode** toggle
- **Status messages** inside download buttons
- **Real-time feedback** (Checking cache → Downloading → Complete!)
- **Color-coded button states** (blue/orange/green/red)
- **Estimated download times** based on file size
- **Responsive design** for all devices

### 🔒 Security & Privacy
- No file storage on server (files are streamed and cached temporarily)
- No user registration required
- No tracking or data collection

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- yt-dlp
- ffmpeg

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/mediadash.git
cd mediadash
