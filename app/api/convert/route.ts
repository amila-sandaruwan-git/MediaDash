export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import { MediaInfo, VideoFormat, AudioFormat } from '../../types'
import * as fs from 'fs/promises'
import * as path from 'path'
import { randomUUID } from 'crypto'
import { cacheManager } from '../../lib/cache'

const execPromise = promisify(exec)

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Helper to check if yt-dlp is installed
async function checkYtDlpInstalled(): Promise<boolean> {
  try {
    await execPromise('yt-dlp --version')
    return true
  } catch {
    return false
  }
}

// URL type detection
function getUrlType(url: string): 'page' | 'direct' | 'unknown' {
  // Check if it's a direct video/audio file or streaming manifest
  if (url.match(/\.(mp4|webm|mov|avi|mkv|m3u8|mpd)(\?.*)?$/i)) {
    return 'direct'
  }
  
  // Check if it's a Reddit page URL
  if (url.match(/reddit\.com\/r\/.*\/comments\/|redd\.it\//i)) {
    return 'page'
  }
  
  // Check for other platform page URLs
  if (url.match(/youtube\.com\/watch|youtu\.be|facebook\.com\/watch|instagram\.com\/p|tiktok\.com\/@|twitter\.com\/.*\/status|x\.com\/.*\/status/i)) {
    return 'page'
  }
  
  return 'unknown'
}

// Get platform name from URL
function getPlatformName(url: string): string {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube'
  if (url.includes('reddit.com') || url.includes('redd.it')) return 'Reddit'
  if (url.includes('facebook.com') || url.includes('fb.watch')) return 'Facebook'
  if (url.includes('instagram.com') || url.includes('instagr.am')) return 'Instagram'
  if (url.includes('tiktok.com') || url.includes('vm.tiktok.com')) return 'TikTok'
  if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter/X'
  if (url.includes('linkedin.com')) return 'LinkedIn'
  if (url.includes('pinterest.com')) return 'Pinterest'
  if (url.includes('snapchat.com')) return 'Snapchat'
  if (url.includes('telegram.org') || url.includes('t.me')) return 'Telegram'
  if (url.includes('discord.com') || url.includes('discord.gg')) return 'Discord'
  if (url.includes('quora.com')) return 'Quora'
  return 'Unknown Platform'
}

export async function POST(request: NextRequest) {
  try {
    const { url, action, formatId, quality } = await request.json()

    // Check if yt-dlp is installed
    const isInstalled = await checkYtDlpInstalled()
    if (!isInstalled) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'yt-dlp is not installed. Please install it first.' 
        },
        { status: 500 }
      )
    }

    // --- URL VALIDATION FOR DIRECT LINKS ---
    const urlType = getUrlType(url)
    const platform = getPlatformName(url)

    // Special handling for Reddit direct links
    if (urlType === 'direct' && (url.includes('redd.it') || url.includes('reddit.com'))) {
      return NextResponse.json({
        success: false,
        message: '❌ Direct Reddit video links often expire and cannot be downloaded reliably.',
        suggestion: 'Please paste the Reddit post page URL instead:',
        example: 'Example: https://www.reddit.com/r/[subreddit]/comments/[post_id]/[title]/',
        platform: 'Reddit'
      }, { status: 400 })
    }

    // Special handling for other direct video links
    if (urlType === 'direct') {
      // Check if it's a direct video link that might work
      const urlObj = new URL(url)
      const pathname = urlObj.pathname.toLowerCase()
      
      // If it's a direct MP4/WebM file, it might work directly
      if (pathname.match(/\.(mp4|webm|mov|avi|mkv)$/)) {
        // Let it proceed - yt-dlp might handle it
        console.log(`Direct video link detected: ${url}`)
      } else {
        // For other direct links, suggest using page URL
        return NextResponse.json({
          success: false,
          message: `⚠️ This appears to be a direct media link from ${platform}.`,
          suggestion: 'For best results, use the page URL instead of the direct video link.',
          platform: platform
        }, { status: 400 })
      }
    }

    // If this is a download request
    if (action === 'download') {
      if (!url || !formatId) {
        return NextResponse.json(
          { success: false, message: 'URL and format ID are required for download' },
          { status: 400 }
        )
      }

      const isAudio = quality === 'audio'
      const cacheKey = isAudio ? 'audio' : `${quality}p`

      // --- CHECK CACHE FIRST ---
      console.log(`[Cache] Checking cache for: ${url} (${cacheKey})`)
      const cached = await cacheManager.getFromCache(url, cacheKey, isAudio ? 'audio' : 'video')
      
      if (cached) {
        console.log(`[Cache] ✅ Cache hit! Serving from cache: ${cacheKey}`)
        const uint8Array = new Uint8Array(cached.buffer)
        return new NextResponse(uint8Array, {
          status: 200,
          headers: {
            'Content-Disposition': `attachment; filename="${cached.metadata.filename}"`,
            'Content-Type': cached.metadata.mimeType,
            'Content-Length': cached.buffer.length.toString(),
            'X-Cache-Status': 'HIT',
            'X-Cache-Size': formatFileSize(cached.buffer.length),
          },
        })
      }

      console.log(`[Cache] ❌ Cache miss. Downloading: ${cacheKey}`)

      // --- NOT IN CACHE - DOWNLOAD ---
      const filename = `${randomUUID()}_${Date.now()}`
      const outputPath = path.join(process.cwd(), 'tmp', filename)
      
      await fs.mkdir(path.join(process.cwd(), 'tmp'), { recursive: true })

      let downloadCommand: string
      let fileExtension: string = 'mp4'
      let mimeType: string = 'video/mp4'

      // Special handling for Reddit - use page URL if it's a direct link
      let downloadUrl = url
      if (urlType === 'direct' && (url.includes('redd.it') || url.includes('reddit.com'))) {
        // This should not happen due to earlier check, but just in case
        throw new Error('Please use the Reddit page URL instead of direct video link')
      }

      if (isAudio) {
        fileExtension = 'mp3'
        mimeType = 'audio/mpeg'
        downloadCommand = `yt-dlp -f "bestaudio[ext=m4a]/bestaudio" --extract-audio --audio-format mp3 --audio-quality 320K -o "${outputPath}.%(ext)s" "${downloadUrl}"`
      } else {
        const height = parseInt(quality) || 720
        downloadCommand = `yt-dlp -f "bestvideo[height<=${height}]+bestaudio[ext=m4a]/best[height<=${height}]" --merge-output-format mp4 -o "${outputPath}.%(ext)s" "${downloadUrl}"`
        fileExtension = 'mp4'
        mimeType = 'video/mp4'
      }

      console.log('Executing download command:', downloadCommand)
      
      const { stdout, stderr } = await execPromise(downloadCommand)

      if (stderr && !stderr.includes('WARNING')) {
        console.error('yt-dlp stderr:', stderr)
      }

      const files = await fs.readdir('tmp')
      const downloadedFile = files.find(f => f.startsWith(filename))

      if (!downloadedFile) {
        return NextResponse.json(
          { success: false, message: 'Download failed - file not found' },
          { status: 500 }
        )
      }

      const filePath = path.join(process.cwd(), 'tmp', downloadedFile)
      const fileBuffer = await fs.readFile(filePath)
      const fileStats = await fs.stat(filePath)
      
      const ext = path.extname(downloadedFile).substring(1)
      
      if (ext === 'mp3') mimeType = 'audio/mpeg'
      else if (ext === 'webm') mimeType = 'video/webm'
      else if (ext === 'mkv') mimeType = 'video/x-matroska'
      else if (ext === 'mp4') mimeType = 'video/mp4'

      // --- SAVE TO CACHE ---
      try {
        console.log(`[Cache] Saving ${cacheKey} to cache...`)
        await cacheManager.saveToCache(
          url,
          cacheKey,
          isAudio ? 'audio' : 'video',
          fileBuffer,
          ext,
          mimeType
        )
        console.log(`[Cache] ✅ Saved to cache: ${cacheKey}`)
      } catch (cacheError) {
        console.error('[Cache] Failed to save to cache:', cacheError)
      }
      
      await fs.unlink(filePath).catch(() => {})

      const uint8Array = new Uint8Array(fileBuffer)
      return new NextResponse(uint8Array, {
        status: 200,
        headers: {
          'Content-Disposition': `attachment; filename="media.${ext}"`,
          'Content-Type': mimeType,
          'Content-Length': fileStats.size.toString(),
          'X-Cache-Status': 'MISS',
          'X-Cache-Size': formatFileSize(fileStats.size),
        },
      })

    } else {
      // --- GET INFO ONLY ---
      console.log('Fetching info for URL:', url)
      
      const command = `yt-dlp --dump-json --no-playlist --skip-download "${url}"`
      
      const { stdout, stderr } = await execPromise(command)

      if (stderr && !stderr.includes('WARNING')) {
        console.error('yt-dlp stderr:', stderr)
      }

      const data = JSON.parse(stdout)

      const videoFormats: VideoFormat[] = data.formats
        .filter((f: any) => f.vcodec !== 'none')
        .map((f: any) => ({
          format_id: f.format_id,
          resolution: f.resolution || `${f.height || 0}p`,
          quality: f.quality_label || f.format_note || 'Standard',
          filesize: f.filesize || f.filesize_approx || 0,
          ext: f.ext,
          url: f.url || ''
        }))
        .filter((f: VideoFormat) => f.url)
        .sort((a: VideoFormat, b: VideoFormat) => {
          const aHeight = parseInt(a.resolution) || 0
          const bHeight = parseInt(b.resolution) || 0
          return bHeight - aHeight
        })

      const audioFormats: AudioFormat[] = data.formats
        .filter((f: any) => f.acodec !== 'none' && f.vcodec === 'none')
        .map((f: any) => ({
          format_id: f.format_id,
          bitrate: f.abr ? `${f.abr}kbps` : f.tbr ? `${f.tbr}kbps` : '128kbps',
          filesize: f.filesize || f.filesize_approx || 0,
          ext: f.ext,
          url: f.url || ''
        }))
        .filter((f: AudioFormat) => f.url)
        .sort((a: AudioFormat, b: AudioFormat) => {
          const aBitrate = parseInt(a.bitrate) || 0
          const bBitrate = parseInt(b.bitrate) || 0
          return bBitrate - aBitrate
        })

      // Check which formats are cached
      const cachedFormats = new Set()
      for (const format of videoFormats) {
        const resMatch = format.resolution.match(/(\d+)/)
        if (resMatch) {
          const isCached = await cacheManager.isCached(url, `${resMatch[0]}p`, 'video')
          if (isCached) cachedFormats.add(resMatch[0])
        }
      }

      const mediaInfo: MediaInfo = {
        title: data.title || 'Untitled',
        thumbnail: data.thumbnail || '',
        duration: data.duration || 0,
        video_formats: videoFormats,
        audio_formats: audioFormats,
        webpage_url: data.webpage_url || url
      }

      return NextResponse.json({
        success: true,
        data: mediaInfo,
        cacheInfo: {
          cachedFormats: Array.from(cachedFormats),
          cacheSize: await cacheManager.getCacheSizeMB(),
          isAudioCached: await cacheManager.isCached(url, 'audio', 'audio'),
        }
      })
    }

  } catch (error: any) {
    console.error('Error:', error)
    
    let errorMessage = 'Failed to process the URL. Please check the URL and try again.'
    let suggestion = ''
    
    if (error.message?.includes('ERROR: Unsupported URL')) {
      errorMessage = 'Unsupported URL. Please use a link from a supported platform.'
      suggestion = 'Supported platforms: YouTube, Facebook, Instagram, TikTok, Twitter/X, Reddit, LinkedIn, and more.'
    } else if (error.message?.includes('ERROR: Video unavailable')) {
      errorMessage = 'Video is unavailable or private. Please check the URL.'
      suggestion = 'Make sure the video is publicly accessible and the URL is correct.'
    } else if (error.message?.includes('ERROR: This video is private')) {
      errorMessage = 'This video is private. Please use a public video URL.'
    } else if (error.message?.includes('ERROR: File not found')) {
      errorMessage = 'The requested file could not be found. Try a different quality.'
    } else if (error.message?.includes('ERROR: Unsupported URL') && error.message?.includes('reddit')) {
      errorMessage = '❌ Direct Reddit video links are not supported.'
      suggestion = 'Please paste the Reddit post page URL instead (e.g., https://www.reddit.com/r/.../comments/...)'
    } else if (error.message?.includes('ERROR: DASH manifest')) {
      errorMessage = 'This is a streaming video that requires special handling.'
      suggestion = 'Please use the page URL instead of the direct video link.'
    }

    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage,
        suggestion: suggestion || undefined
      },
      { status: 500 }
    )
  }
}